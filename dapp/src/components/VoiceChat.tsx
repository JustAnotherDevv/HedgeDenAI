import { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Send,
  User,
  Bot,
  Trash,
  Play,
  AlertCircle,
  Loader,
  Check,
  X,
  Settings,
  RefreshCw,
  Globe,
  Volume2,
  Info,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

=const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "ja", name: "Japanese" },
  { code: "zh", name: "Chinese" },
  { code: "ru", name: "Russian" },
  { code: "pt", name: "Portuguese" },
  { code: "it", name: "Italian" },
  { code: "nl", name: "Dutch" },
  { code: "ar", name: "Arabic" },
];

const chatModels = [
  { id: "gpt-4-0125-preview", name: "GPT-4 Turbo (Most Capable)" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo (Faster)" },
  { id: "gpt-4-vision-preview", name: "GPT-4 Vision (For Images)" },
];

export default function VoiceChat() {
  const [recording, setRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [aiTyping, setAiTyping] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [micPermission, setMicPermission] = useState(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [saveApiKey, setSaveApiKey] = useState(false);
  const [apiEndpoint, setApiEndpoint] = useState(
    "https://api.openai.com/v1/audio/transcriptions"
  );
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingStartTime, setRecordingStartTime] = useState(null);
  const [selectedChatModel, setSelectedChatModel] =
    useState("gpt-4-0125-preview");

  const chatContainerRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationFrameRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordingTimerRef = useRef(null);

  useEffect(() => {
    console.log("Component mounted, applying animation");
    setTimeout(() => setAnimate(true), 100);

    const savedApiKey =
      "openai_api_key"
    // localStorage.getItem("whisper_api_key");
    if (savedApiKey) {
      console.log("Found saved API key in localStorage");
      setApiKey(savedApiKey);
      setSaveApiKey(true);
    } else {
      console.log("No saved API key found");
    }
  }, []);

  // Check microphone permission
  useEffect(() => {
    console.log("Requesting microphone permission...");
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        console.log("Microphone permission granted");
        setMicPermission(true);
        mediaStreamRef.current = stream;

        // Set up audio analysis for visualization
        console.log("Setting up audio analyzer");
        audioContextRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyserRef.current);
        analyserRef.current.fftSize = 256;

        const bufferLength = analyserRef.current.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);
        console.log(`Audio analyzer buffer length: ${bufferLength}`);
      })
      .catch((err) => {
        console.error("Microphone access error:", err);
        setMicPermission(false);
      });

    return () => {
      console.log("Cleaning up audio resources");
      if (mediaStreamRef.current) {
        console.log("Stopping media stream tracks");
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        console.log("Closing audio context");
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        console.log("Canceling animation frame");
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
      console.log("Scrolled chat to bottom");
    }
  }, [chatHistory]);

  useEffect(() => {
    if (recording && analyserRef.current && dataArrayRef.current) {
      console.log("Starting audio level visualization");
      const updateAudioLevel = () => {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);

        const average =
          dataArrayRef.current.reduce((sum, value) => sum + value, 0) /
          dataArrayRef.current.length;

        const normalizedLevel = Math.min(100, average * 1.2);
        setAudioLevel(normalizedLevel);

        if (Math.random() < 0.05) {
          console.log(`Current audio level: ${normalizedLevel.toFixed(2)}`);
        }

        animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      };

      updateAudioLevel();
    } else if (animationFrameRef.current) {
      console.log("Stopping audio level visualization");
      cancelAnimationFrame(animationFrameRef.current);
      setAudioLevel(0);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [recording]);

  useEffect(() => {
    if (saveApiKey && apiKey) {
      console.log("Saving API key to localStorage");
      localStorage.setItem("whisper_api_key", apiKey);
    } else if (!saveApiKey) {
      console.log("Removing API key from localStorage");
      localStorage.removeItem("whisper_api_key");
    }
  }, [saveApiKey, apiKey]);

  useEffect(() => {
    if (recording && recordingStartTime) {
      console.log("Starting recording duration timer");
      recordingTimerRef.current = setInterval(() => {
        const elapsedSeconds = Math.floor(
          (Date.now() - recordingStartTime) / 1000
        );
        setRecordingDuration(elapsedSeconds);
        console.log(`Recording duration: ${elapsedSeconds}s`);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        console.log("Clearing recording duration timer");
        clearInterval(recordingTimerRef.current);
      }
    }

    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [recording, recordingStartTime]);

  const toggleRecording = async () => {
    if (recording) {
      console.log("Stopping recording");

      if (
        mediaRecorderRef.current?.recorder &&
        mediaRecorderRef.current.recorder.state === "recording"
      ) {
        try {
          console.log("Stopping media recorder");
          mediaRecorderRef.current.recorder.stop();
        } catch (e) {
          console.error("Error stopping media recorder:", e);
        }
      }

      setRecording(false);
      setRecordingStartTime(null);
      setRecordingDuration(0);
    } else {
      console.log("Starting new recording");
      setTranscription("");

      if (!apiKey) {
        console.error("No API key provided");
        setChatHistory((prev) => [
          ...prev,
          {
            sender: "system",
            content:
              "OpenAI API key is required for speech recognition. Please add your API key in settings.",
            timestamp: new Date().toISOString(),
            isNotification: true,
            isError: true,
          },
        ]);
        setShowSettings(true);
        return;
      }

      startRecording();
    }
  };

  const startRecording = () => {
    if (!mediaStreamRef.current) {
      console.error("No media stream available");
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "system",
          content:
            "Microphone access is required for recording. Please enable microphone permissions in your browser settings.",
          timestamp: new Date().toISOString(),
          isNotification: true,
          isError: true,
        },
      ]);
      return;
    }

    setRecording(true);
    setRecordingStartTime(Date.now());

    console.log("Starting audio recording for Whisper API");
    setChatHistory((prev) => [
      ...prev,
      {
        sender: "system",
        content:
          "Recording started. Speak clearly into your microphone and tap the microphone button when finished.",
        timestamp: new Date().toISOString(),
        isNotification: true,
      },
    ]);

    const chunks = [];
    console.log("Creating MediaRecorder with audio/webm;codecs=opus format");
    const mediaRecorder = new MediaRecorder(mediaStreamRef.current, {
      mimeType: "audio/webm;codecs=opus",
    });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        console.log(`Received audio chunk: ${e.data.size} bytes`);
        chunks.push(e.data);
      }
    };

    mediaRecorder.onstart = () => {
      console.log("MediaRecorder started");
    };

    mediaRecorder.onstop = async () => {
      console.log("MediaRecorder stopped");
      const audioBlob = new Blob(chunks, { type: "audio/webm" });
      console.log(`Total audio size: ${audioBlob.size} bytes`);

      setProcessing(true);
      setRecording(false);

      sendAudioToWhisperAPI(audioBlob);
    };

    mediaRecorder.onerror = (event) => {
      console.error("MediaRecorder error:", event);
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "system",
          content: `Recording error: ${event.error || "Unknown error"}`,
          timestamp: new Date().toISOString(),
          isError: true,
          isNotification: true,
        },
      ]);
    };

    try {
      mediaRecorder.start();
      console.log("MediaRecorder started successfully");
    } catch (error) {
      console.error("Failed to start MediaRecorder:", error);
      setRecording(false);
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "system",
          content: `Failed to start recording: ${error.message}`,
          timestamp: new Date().toISOString(),
          isNotification: true,
          isError: true,
        },
      ]);
      return;
    }

    const recordingTimeout = setTimeout(() => {
      if (mediaRecorder.state === "recording") {
        console.log("Auto-stopping recording after 30 seconds");
        mediaRecorder.stop();
        setRecording(false);
      }
    }, 30000);

    const notificationTimeout = setTimeout(() => {
      if (mediaRecorder.state === "recording") {
        console.log("Showing recording reminder notification");
        setChatHistory((prev) => [
          ...prev,
          {
            sender: "system",
            content:
              "Tap the microphone button again when you're done speaking.",
            timestamp: new Date().toISOString(),
            isNotification: true,
          },
        ]);
      }
    }, 5000);

    mediaRecorderRef.current = {
      recorder: mediaRecorder,
      timeouts: [recordingTimeout, notificationTimeout],
    };
  };

  const sendAudioToWhisperAPI = async (audioBlob) => {
    console.log("Preparing to send audio to Whisper API");

    if (!apiKey) {
      console.error("No API key available");
      setShowConfirmation(true);
      setTranscription("Error: API key is required for speech recognition");
      setProcessing(false);
      return;
    }

    try {
      console.log("Creating FormData with audio blob");
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.webm");
      formData.append("model", "whisper-1");

      if (selectedLanguage) {
        console.log(`Setting language hint to: ${selectedLanguage}`);
        formData.append("language", selectedLanguage);
      }

      console.log(`Sending request to ${apiEndpoint}`);
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: formData,
      });

      console.log(`API response status: ${response.status}`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error response: ${errorText}`);
        throw new Error(`API error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log("API response data:", data);

      if (data.text) {
        console.log(`Transcription received: "${data.text.trim()}"`);
        setTranscription(data.text.trim());
        setShowConfirmation(true);
      } else {
        console.error("No transcription in API response");
        throw new Error("No transcription received from API");
      }
    } catch (error) {
      console.error("Error with Whisper API:", error);
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "system",
          content: `Error transcribing audio: ${error.message}`,
          timestamp: new Date().toISOString(),
          isError: true,
          isNotification: true,
        },
      ]);

      setTranscription(
        "Error transcribing audio. Please check your API key and try again."
      );
      setShowConfirmation(true);
    } finally {
      setProcessing(false);
    }
  };

  const cleanupRecording = () => {
    console.log("Cleaning up recording resources");

    if (
      mediaRecorderRef.current?.recorder &&
      mediaRecorderRef.current.recorder.state === "recording"
    ) {
      try {
        console.log("Stopping media recorder");
        mediaRecorderRef.current.recorder.stop();
      } catch (e) {
        console.error("Error stopping media recorder:", e);
      }
    }

    if (mediaRecorderRef.current?.timeouts) {
      console.log("Clearing recording timeouts");
      mediaRecorderRef.current.timeouts.forEach((timeout) =>
        clearTimeout(timeout)
      );
    }

    setRecording(false);
    setRecordingStartTime(null);
    setRecordingDuration(0);
  };

  const cancelTranscription = () => {
    console.log("Canceling transcription");
    setTranscription("");
    setShowConfirmation(false);
  };

  const sendMessageToOpenAI = async (messages) => {
    console.log("Sending request to OpenAI Chat API");
    console.log("Messages:", JSON.stringify(messages, null, 2));

    if (!apiKey) {
      console.error("No API key provided for Chat API");
      throw new Error("OpenAI API key is required for chat functionality");
    }

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: selectedChatModel,
            messages: messages,
            temperature: 0.7,
            max_tokens: 800,
          }),
        }
      );

      console.log(`API response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Chat API error response: ${errorText}`);
        throw new Error(`API error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log("OpenAI Chat API response:", data);

      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        console.log(
          `AI response received: "${data.choices[0].message.content.substring(
            0,
            100
          )}..."`
        );
        return data.choices[0].message.content;
      } else {
        console.error("Unexpected API response format:", data);
        throw new Error("No valid response received from API");
      }
    } catch (error) {
      console.error("Error calling OpenAI Chat API:", error);
      throw error;
    }
  };

  const sendMessage = async () => {
    if (!transcription.trim()) {
      console.log("No transcription to send");
      return;
    }

    console.log(`Sending message: "${transcription}"`);
    const userMessage = {
      sender: "user",
      content: transcription,
      timestamp: new Date().toISOString(),
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setShowConfirmation(false);
    setTranscription("");
    setProcessing(true);

    const conversationContext = chatHistory
      .filter((msg) => !msg.isNotification) // Filter for notifications
      .slice(-5) // last 5 messages for context
      .map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.content,
      }));

    conversationContext.push({
      role: "user",
      content: transcription,
    });

    const systemMessage = {
      role: "system",
      content:
        // "You are an AI financial advisor assistant named HedgeDen AI. You provide helpful, accurate, and clear information on investment strategy, portfolio management, market trends, and financial planning. Keep responses concise but informative.",
        "",
    };

    const messagesWithSystem = [systemMessage, ...conversationContext];

    console.log("Conversation context:", messagesWithSystem);

    setAiTyping(true);
    try {
      console.log("Calling OpenAI Chat API");
      const aiResponse = await sendMessageToOpenAI(messagesWithSystem);

      console.log(
        `AI response received, length: ${aiResponse.length} characters`
      );

      const aiMessage = {
        sender: "ai",
        content: aiResponse,
        timestamp: new Date().toISOString(),
      };

      setChatHistory((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "ai",
          content: `I'm sorry, I encountered an error processing your request: ${error.message}. Please check your API key and try again.`,
          timestamp: new Date().toISOString(),
          isError: true,
        },
      ]);
    } finally {
      setAiTyping(false);
      setProcessing(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const clearChat = () => {
    console.log("Clearing chat history");
    setChatHistory([]);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const saveSettings = () => {
    console.log("Saving settings");
    if (saveApiKey) {
      localStorage.setItem("whisper_api_key", apiKey);
      console.log("API key saved to localStorage");
    } else {
      localStorage.removeItem("whisper_api_key");
      console.log("API key removed from localStorage");
    }
    setShowSettings(false);
  };

  const AudioLevelVisualization = ({ level }) => {
    const bars = 10;
    const activeBars = Math.floor((level / 100) * bars);

    return (
      <div className="flex items-center gap-1 h-4">
        {Array.from({ length: bars }).map((_, i) => (
          <div
            key={i}
            className={`w-1 rounded-full ${
              i < activeBars ? "bg-red-500" : "bg-gray-200"
            }`}
            style={{
              height: `${Math.min(100, (i + 1) * 10)}%`,
              transition: "background-color 0.1s ease",
            }}
          ></div>
        ))}
      </div>
    );
  };

  return (
    <div
      className={`container mx-auto p-6 space-y-8 transition-opacity duration-700 ${
        animate ? "opacity-100" : "opacity-0"
      }`}
    >
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-primary neumorphic-text">
            AI Voice Assistant
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <button className="neumorphic-button p-2">
                <Settings className="h-5 w-5 text-muted-foreground" />
              </button>
            </DialogTrigger>
            <DialogContent className="neumorphic-card border-0">
              <DialogHeader>
                <DialogTitle className="text-xl neumorphic-text">
                  Voice Settings
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-5 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    OpenAI API Key
                  </label>
                  <Input
                    type="password"
                    placeholder="sk-..."
                    className="neumorphic-input"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch
                      id="save-api-key"
                      checked={saveApiKey}
                      onCheckedChange={setSaveApiKey}
                    />
                    <Label
                      htmlFor="save-api-key"
                      className="text-xs text-muted-foreground"
                    >
                      Save API key in browser
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Required for both Whisper API speech recognition and Chat
                    API responses. Get your API key from{" "}
                    <a
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      OpenAI dashboard
                    </a>
                    .
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Chat Model
                  </label>
                  <Select
                    value={selectedChatModel}
                    onValueChange={setSelectedChatModel}
                  >
                    <SelectTrigger className="neumorphic-input">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      {chatModels.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    GPT-4 Turbo provides the best responses but costs more.
                    GPT-3.5 is faster and cheaper.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Speech Recognition Language
                  </label>
                  <Select
                    value={selectedLanguage}
                    onValueChange={setSelectedLanguage}
                  >
                    <SelectTrigger className="neumorphic-input">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Choose the language you're speaking in for better Whisper
                    API recognition.
                  </p>
                </div>

                <div className="neumorphic-card-concave p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Volume2 className="h-4 w-4 text-primary" />
                    <h4 className="font-medium text-sm">Microphone Status</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {micPermission === true
                      ? "Microphone connected and working properly."
                      : micPermission === false
                      ? "Microphone permission denied."
                      : "Checking microphone status..."}
                  </p>
                </div>

                <div className="neumorphic-card-concave p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-4 w-4 text-primary" />
                    <h4 className="font-medium text-sm">API Endpoint</h4>
                  </div>
                  <Input
                    type="text"
                    className="neumorphic-input text-xs mt-2"
                    value={apiEndpoint}
                    onChange={(e) => setApiEndpoint(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Default: https://api.openai.com/v1/audio/transcriptions
                  </p>
                </div>
              </div>
              <DialogFooter>
                <button
                  className="neumorphic-button text-primary w-full font-medium"
                  onClick={saveSettings}
                >
                  Save Settings
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="neumorphic-card h-[calc(100vh-13rem)] flex flex-col">
        <div className="flex items-center justify-between mb-6 px-2">
          <h3 className="text-xl font-semibold neumorphic-text">
            Chat with HedgeDen AI
          </h3>
          <button
            className="neumorphic-button text-muted-foreground font-medium"
            onClick={clearChat}
          >
            <Trash className="h-4 w-4 mr-2" />
            Clear Chat
          </button>
        </div>

        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto space-y-4 p-4 mb-4 neumorphic-card-concave"
        >
          {chatHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Bot className="h-12 w-12 mb-4 text-primary opacity-50" />
              <p className="text-lg text-muted-foreground">
                Start a conversation by using the microphone
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Ask about portfolio advice, market trends, or investment
                strategies
              </p>
            </div>
          ) : (
            chatHistory.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-3/4 md:max-w-2/3 rounded-2xl p-4 ${
                    message.sender === "user"
                      ? "neumorphic-card mr-2 bg-gradient-to-br from-primary/10 to-primary/5"
                      : message.isError
                      ? "neumorphic-card-concave ml-2 bg-red-50/30"
                      : message.isNotification
                      ? "neumorphic-card-concave ml-2 bg-blue-50/30"
                      : "neumorphic-card-concave ml-2"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div
                      className={`p-2 rounded-full flex-shrink-0 ${
                        message.sender === "user"
                          ? "bg-primary/10"
                          : message.isError
                          ? "bg-red-50"
                          : message.isNotification
                          ? "bg-blue-50"
                          : "bg-indigo-50"
                      }`}
                    >
                      {message.sender === "user" ? (
                        <User className="h-4 w-4 text-primary" />
                      ) : message.isError ? (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      ) : message.isNotification ? (
                        <Info className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Bot className="h-4 w-4 text-indigo-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm sm:text-base">{message.content}</p>
                      <p className="text-xs text-muted-foreground text-right mt-1">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {aiTyping && (
            <div className="flex justify-start">
              <div className="neumorphic-card-concave ml-2 p-4 rounded-2xl">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-indigo-50">
                    <Bot className="h-4 w-4 text-indigo-500" />
                  </div>
                  <div className="flex space-x-1">
                    <div
                      className="h-2 w-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 neumorphic-card">
          <div className="flex items-end gap-2">
            {showConfirmation ? (
              <>
                <div className="flex-1 neumorphic-card-concave p-3 min-h-12">
                  <p className="text-sm">{transcription}</p>
                </div>
                <button
                  className="neumorphic-button p-3 text-green-500"
                  onClick={sendMessage}
                  disabled={processing}
                >
                  <Check className="h-5 w-5" />
                </button>
                <button
                  className="neumorphic-button p-3 text-red-500"
                  onClick={cancelTranscription}
                  disabled={processing}
                >
                  <X className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <button
                  className={`neumorphic-button p-4 ${
                    recording
                      ? "bg-red-50 text-red-500 shadow-inner"
                      : "text-primary"
                  } ${
                    processing || !apiKey ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={toggleRecording}
                  disabled={processing || micPermission === false || !apiKey}
                >
                  {recording ? (
                    <MicOff className="h-6 w-6" />
                  ) : (
                    <Mic className="h-6 w-6" />
                  )}
                </button>
                <div className="flex-1 neumorphic-card-concave p-3 min-h-12">
                  {recording ? (
                    <div className="flex items-center">
                      <div className="flex-1">
                        <p className="text-sm">
                          Recording... {formatDuration(recordingDuration)}
                        </p>
                      </div>
                      <div className="flex items-center ml-2">
                        <AudioLevelVisualization level={audioLevel} />
                      </div>
                    </div>
                  ) : processing ? (
                    <div className="flex items-center">
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">
                          Processing speech via Whisper API...
                        </p>
                      </div>
                      <Loader className="h-4 w-4 animate-spin text-primary ml-2" />
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {transcription
                        ? transcription
                        : !apiKey
                        ? "Please add your OpenAI API key in settings"
                        : "Tap the microphone to speak..."}
                    </p>
                  )}
                </div>
                {transcription && !recording && !processing && (
                  <button
                    className="neumorphic-button p-3 text-primary"
                    onClick={() => setShowConfirmation(true)}
                  >
                    <Send className="h-5 w-5" />
                  </button>
                )}
              </>
            )}
          </div>

          {micPermission === false && (
            <div className="mt-4 neumorphic-card-concave p-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-sm text-muted-foreground">
                  Microphone access denied. Please enable microphone permissions
                  in your browser settings.
                </p>
              </div>
            </div>
          )}

          {!apiKey && (
            <div className="mt-4 neumorphic-card-concave p-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <p className="text-sm text-muted-foreground">
                  OpenAI API key is required for speech recognition.
                  <button
                    className="text-primary underline ml-1"
                    onClick={() => setShowSettings(true)}
                  >
                    Add API key
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="neumorphic-card transform transition-transform hover:scale-[1.02]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-full">
              <Play className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Voice Commands</h3>
          </div>

          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {languages.find((l) => l.code === selectedLanguage)?.name ||
                "English"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="neumorphic-card-concave p-3">
            <p className="text-sm font-medium mb-1">Portfolio Analysis</p>
            <p className="text-xs text-muted-foreground">
              "Analyze my portfolio performance"
            </p>
          </div>

          <div className="neumorphic-card-concave p-3">
            <p className="text-sm font-medium mb-1">Market Insights</p>
            <p className="text-xs text-muted-foreground">
              "What's your take on the current market?"
            </p>
          </div>

          <div className="neumorphic-card-concave p-3">
            <p className="text-sm font-medium mb-1">Investment Advice</p>
            <p className="text-xs text-muted-foreground">
              "Should I increase my Bitcoin allocation?"
            </p>
          </div>

          <div className="neumorphic-card-concave p-3">
            <p className="text-sm font-medium mb-1">Risk Assessment</p>
            <p className="text-xs text-muted-foreground">
              "What's my portfolio risk level?"
            </p>
          </div>
        </div>

        <div className="mt-6 neumorphic-card-concave p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-5 w-5 text-primary" />
            <h4 className="font-medium">Troubleshooting Tips</h4>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <div className="rounded-full bg-blue-50 text-blue-700 h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </div>
              <span>
                Make sure you've added your OpenAI API key in settings.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="rounded-full bg-blue-50 text-blue-700 h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </div>
              <span>
                Speak clearly and at a moderate pace for best recognition.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="rounded-full bg-blue-50 text-blue-700 h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </div>
              <span>If using Chrome, ensure you're on HTTPS or localhost.</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="rounded-full bg-blue-50 text-blue-700 h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                4
              </div>
              <span>
                Check console logs for debugging information if issues occur.
              </span>
            </li>
          </ul>
        </div>
      </div>

      <Dialog open={micPermission === false}>
        <DialogContent className="neumorphic-card border-0">
          <DialogHeader>
            <DialogTitle className="text-xl neumorphic-text">
              Microphone Access Required
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="neumorphic-card-concave p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-red-500" />
                <p className="text-sm">
                  Voice chat requires microphone access. Please enable
                  microphone permissions in your browser settings.
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              After enabling permissions, click the refresh button below to try
              again.
            </p>
          </div>
          <DialogFooter>
            <button
              className="neumorphic-button text-primary w-full font-medium"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Page
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
