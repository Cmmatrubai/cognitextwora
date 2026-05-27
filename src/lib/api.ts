let isLocalDev = localStorage.getItem("cognitext-api-local") === "true";
let isMockDev = localStorage.getItem("cognitext-api-mock") === "true";

export function setLocalApiMode(local: boolean) {
  isLocalDev = local;
  localStorage.setItem("cognitext-api-local", String(local));
}

export function getLocalApiMode(): boolean {
  return isLocalDev;
}

export function setMockApiMode(mock: boolean) {
  isMockDev = mock;
  localStorage.setItem("cognitext-api-mock", String(mock));
}

export function getMockApiMode(): boolean {
  return isMockDev;
}

const getBaseUrl = () => isLocalDev ? "http://localhost:8081" : "";
const getUserUrl = () => isLocalDev ? "http://localhost:8081/api" : "/api";
const getSimplifyUrl = () => isLocalDev ? "http://localhost:8080/api/v1" : "/api/v1";

export const getToken = () => localStorage.getItem("cognitext-token");
export const setToken = (token: string) => localStorage.setItem("cognitext-token", token);
export const removeToken = () => localStorage.removeItem("cognitext-token");

function getHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    ...extraHeaders,
  };
}

export interface UserPreference {
  theme: string;
  targetGradeLevel: number;
  fontSize: string;
  ocrThreshold: number;
  ttsEnabled: boolean;
  ttsRate: number;
  preferredTargetLanguage: string;
  activeReadingProfileId: string;
  readingProfilesJson: string | null;
  outputStyle: string;
  outputLength: string;
  readingSpacing: string;
  overlaySize: string;
  saveBehavior: string;
  autoSaveEnabled: boolean;
}

export interface UsageSummary {
  plan: string;
  subscriptionStatus: string;
  hourlyUsed: number;
  hourlyLimit: number | null;
  dailyUsed: number;
  dailyLimit: number | null;
  monthlyUsed: number;
  monthlyLimit: number | null;
  nextDailyResetAt: string;
  nextMonthlyResetAt: string;
}

export interface UsageEvent {
  id: number;
  actionType: string;
  units: number;
  createdAt: string;
}

export interface UserResponse {
  id: number;
  email: string;
  fullName: string;
  pictureUrl: string;
  onboardingStep: number;
  preferences: UserPreference;
  plan: string;
  subscriptionStatus: string;
  usageSummary: UsageSummary | null;
}

export interface SimplificationRequest {
  text: string;
  gradeLevel: number;
  outputStyle?: string;
  outputLength?: string;
}

export interface SimplificationResponse {
  simplifiedText: string;
  gradeLevel: number;
  status: string;
  message?: string;
}

export interface TranslationRequest {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string;
}

export interface TranslationResponse {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  status: string;
  message?: string;
}

export interface ImageSimplifyRequest {
  imageBase64: string; // Base64 encoded image string
  gradeLevel?: number;
  outputStyle?: string;
  outputLength?: string;
}

export interface ImageSimplifyResponse {
  transcription: string;
  simplifiedText: string;
  status: string;
  message?: string;
}

export function mapProfileToOutputStyle(profile?: string): string {
  if (!profile) return "plain";
  switch (profile.toLowerCase()) {
    case "dyslexia":
      return "step-by-step";
    case "adhd":
      return "concise";
    case "esl":
      return "student-friendly";
    case "calm":
      return "plain";
    case "professional":
      return "professional";
    default:
      if (["plain", "concise", "student-friendly", "step-by-step", "professional"].includes(profile.toLowerCase())) {
        return profile.toLowerCase();
      }
      return "plain";
  }
}

export function mapOutputStyleToProfile(outputStyle?: string): string {
  if (!outputStyle) return "calm";
  switch (outputStyle.toLowerCase()) {
    case "step-by-step":
      return "dyslexia";
    case "concise":
      return "adhd";
    case "student-friendly":
      return "esl";
    case "plain":
      return "calm";
    case "professional":
      return "professional";
    default:
      if (["dyslexia", "adhd", "esl", "calm", "professional"].includes(outputStyle.toLowerCase())) {
        return outputStyle.toLowerCase();
      }
      return "calm";
  }
}

export function normalizeUserResponse(user: UserResponse): UserResponse {
  if (user && user.preferences) {
    user.preferences.outputStyle = mapOutputStyleToProfile(user.preferences.outputStyle);
  }
  return user;
}

export async function devAuth(email: string): Promise<{ token: string; user: UserResponse }> {
  if (isMockDev) {
    const token = `mock-token-${email}`;
    const mockUser = {
      id: 9999,
      email,
      fullName: email.split("@")[0],
      pictureUrl: `https://ui-avatars.com/api/?name=${email}&background=random`,
      onboardingStep: 0,
      preferences: {
        theme: "light",
        targetGradeLevel: 5,
        fontSize: "medium",
        ocrThreshold: 70,
        ttsEnabled: false,
        ttsRate: 1.0,
        preferredTargetLanguage: "es",
        activeReadingProfileId: "default",
        readingProfilesJson: null,
        outputStyle: "calm",
        outputLength: "medium",
        readingSpacing: "medium",
        overlaySize: "medium",
        saveBehavior: "auto",
        autoSaveEnabled: true,
      },
      plan: "FREE",
      subscriptionStatus: "ACTIVE",
      usageSummary: {
        plan: "FREE",
        subscriptionStatus: "ACTIVE",
        hourlyUsed: 0,
        hourlyLimit: 60,
        dailyUsed: 0,
        dailyLimit: 5,
        monthlyUsed: 0,
        monthlyLimit: null,
        nextDailyResetAt: new Date(Date.now() + 86400000).toISOString(),
        nextMonthlyResetAt: new Date(Date.now() + 86400000 * 30).toISOString(),
      },
    };
    localStorage.setItem("mock-user-preferences", JSON.stringify(mockUser.preferences));
    localStorage.setItem("mock-user-onboarding", "0");
    localStorage.setItem("mock-user-plan", "FREE");
    localStorage.setItem("mock-user-events", JSON.stringify([]));
    localStorage.setItem("mock-usage-daily", "0");
    return { token, user: mockUser };
  }

  const response = await fetch(`${getUserUrl()}/auth/dev`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Failed to authenticate dev user");
  }
  const data = await response.json();
  return {
    token: data.token,
    user: normalizeUserResponse(data.user)
  };
}

export async function googleAuth(idToken: string): Promise<{ token: string; user: UserResponse }> {
  const response = await fetch(`${getUserUrl()}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Failed to authenticate Google user");
  }
  const data = await response.json();
  return {
    token: data.token,
    user: normalizeUserResponse(data.user)
  };
}

export async function getMyPreferences(): Promise<UserResponse> {
  const token = getToken();
  if (token?.startsWith("mock-")) {
    const email = token.replace("mock-token-", "");
    const name = email.split("@")[0];
    const prefsJson = localStorage.getItem("mock-user-preferences");
    const preferences = prefsJson ? JSON.parse(prefsJson) : {
      theme: "light",
      targetGradeLevel: 5,
      fontSize: "medium",
      ocrThreshold: 70,
      ttsEnabled: false,
      ttsRate: 1.0,
      preferredTargetLanguage: "es",
      activeReadingProfileId: "default",
      readingProfilesJson: null,
      outputStyle: "calm",
      outputLength: "medium",
      readingSpacing: "medium",
      overlaySize: "medium",
      saveBehavior: "auto",
      autoSaveEnabled: true,
    };
    const onboardingStep = parseInt(localStorage.getItem("mock-user-onboarding") || "0");
    const plan = localStorage.getItem("mock-user-plan") || "FREE";
    return {
      id: 9999,
      email,
      fullName: name,
      pictureUrl: `https://ui-avatars.com/api/?name=${email}&background=random`,
      onboardingStep,
      preferences,
      plan,
      subscriptionStatus: "ACTIVE",
      usageSummary: {
        plan,
        subscriptionStatus: "ACTIVE",
        hourlyUsed: parseInt(localStorage.getItem("mock-usage-hourly") || "0"),
        hourlyLimit: 60,
        dailyUsed: parseInt(localStorage.getItem("mock-usage-daily") || "0"),
        dailyLimit: plan === "plus" ? null : 5,
        monthlyUsed: parseInt(localStorage.getItem("mock-usage-monthly") || "0"),
        monthlyLimit: null,
        nextDailyResetAt: new Date(Date.now() + 86400000).toISOString(),
        nextMonthlyResetAt: new Date(Date.now() + 86400000 * 30).toISOString(),
      },
    };
  }

  const response = await fetch(`${getUserUrl()}/users/me/preferences`, {
    method: "GET",
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch preferences");
  }
  const data = await response.json();
  return normalizeUserResponse(data);
}

export async function updateMyPreferences(prefs: Partial<UserPreference>): Promise<UserResponse> {
  const token = getToken();
  if (token?.startsWith("mock-")) {
    const current = await getMyPreferences();
    const updatedPrefs = { ...current.preferences, ...prefs };
    localStorage.setItem("mock-user-preferences", JSON.stringify(updatedPrefs));
    if (prefs.theme) {
      localStorage.setItem("cognitext-theme", prefs.theme);
    }
    return { ...current, preferences: updatedPrefs };
  }

  const mappedPrefs = { ...prefs };
  if (mappedPrefs.outputStyle) {
    mappedPrefs.outputStyle = mapProfileToOutputStyle(mappedPrefs.outputStyle);
  }

  const response = await fetch(`${getUserUrl()}/users/me/preferences`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(mappedPrefs),
  });
  if (!response.ok) {
    throw new Error("Failed to update preferences");
  }
  const data = await response.json();
  return normalizeUserResponse(data);
}

export async function updateMyOnboarding(step: number): Promise<UserResponse> {
  const token = getToken();
  if (token?.startsWith("mock-")) {
    localStorage.setItem("mock-user-onboarding", String(step));
    return getMyPreferences();
  }

  const response = await fetch(`${getUserUrl()}/users/me/onboarding`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ step }),
  });
  if (!response.ok) {
    throw new Error("Failed to update onboarding step");
  }
  const data = await response.json();
  return normalizeUserResponse(data);
}

export async function getUsage(): Promise<UsageSummary> {
  const token = getToken();
  if (token?.startsWith("mock-")) {
    const profile = await getMyPreferences();
    return profile.usageSummary!;
  }

  const response = await fetch(`${getUserUrl()}/users/me/usage`, {
    method: "GET",
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch usage summary");
  }
  return response.json();
}

export async function getRecentEvents(limit: number = 10): Promise<UsageEvent[]> {
  const token = getToken();
  if (token?.startsWith("mock-")) {
    const eventsJson = localStorage.getItem("mock-user-events");
    const events = eventsJson ? JSON.parse(eventsJson) : [
      { id: 1, actionType: "simplify_text", units: 1, createdAt: new Date(Date.now() - 3600000).toISOString() },
      { id: 2, actionType: "translate", units: 1, createdAt: new Date(Date.now() - 7200000).toISOString() },
    ];
    return events.slice(0, limit);
  }

  const response = await fetch(`${getUserUrl()}/users/me/usage/events?limit=${limit}`, {
    method: "GET",
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch usage events");
  }
  return response.json();
}

export async function simplifyText(req: SimplificationRequest): Promise<SimplificationResponse> {
  const token = getToken();
  if (token?.startsWith("mock-")) {
    const daily = parseInt(localStorage.getItem("mock-usage-daily") || "0") + 1;
    localStorage.setItem("mock-usage-daily", String(daily));
    
    const eventsJson = localStorage.getItem("mock-user-events");
    const events = eventsJson ? JSON.parse(eventsJson) : [];
    events.unshift({
      id: Date.now(),
      actionType: "simplify_text",
      units: 1,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem("mock-user-events", JSON.stringify(events));

    const style = req.outputStyle || "standard";
    const length = req.outputLength || "medium";
    const grade = req.gradeLevel || 5;

    let simplified = `Here is a simplified explanation (optimized for Grade ${grade}, style: ${style}, length: ${length}):\n\n`;
    if (req.text.toLowerCase().includes("quantum")) {
      simplified += "Quantum computing is a type of computing that uses quantum mechanics to solve problems. Unlike normal computers which use bits (0s and 1s), quantum computers use qubits. Qubits can exist in multiple states at the same time, allowing them to calculate many possibilities very quickly.";
    } else {
      simplified += `We've simplified your text to be easier to read. Main idea: ${req.text.substring(0, 120)}${req.text.length > 120 ? "..." : ""}\n\nThis makes it easier to follow, with shorter sentences and simpler words matching reading level ${grade}.`;
    }

    return {
      simplifiedText: simplified,
      gradeLevel: grade,
      status: "success",
    };
  }

  const mappedReq = {
    ...req,
    outputStyle: mapProfileToOutputStyle(req.outputStyle)
  };

  const response = await fetch(`${getSimplifyUrl()}/simplify`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(mappedReq),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to simplify text");
  }
  return response.json();
}

export async function translateText(req: TranslationRequest): Promise<TranslationResponse> {
  const token = getToken();
  if (token?.startsWith("mock-")) {
    const daily = parseInt(localStorage.getItem("mock-usage-daily") || "0") + 1;
    localStorage.setItem("mock-usage-daily", String(daily));

    const eventsJson = localStorage.getItem("mock-user-events");
    const events = eventsJson ? JSON.parse(eventsJson) : [];
    events.unshift({
      id: Date.now(),
      actionType: "translate",
      units: 1,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem("mock-user-events", JSON.stringify(events));

    const target = req.targetLanguage || "Spanish";
    let translated = `[Simulated Translation to ${target}]:\n\n`;
    if (target.toLowerCase() === "es" || target.toLowerCase() === "spanish") {
      translated += "Hola, este es un texto de ejemplo traducido al español para simular la respuesta del servicio.";
    } else {
      translated += `This is a mock translation of your text into ${target}: "${req.text.substring(0, 100)}..."`;
    }

    return {
      translatedText: translated,
      sourceLanguage: req.sourceLanguage || "en",
      targetLanguage: target,
      status: "success",
    };
  }

  const response = await fetch(`${getSimplifyUrl()}/translate`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(req),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to translate text");
  }
  return response.json();
}

export async function transcribeAndSimplify(req: ImageSimplifyRequest): Promise<ImageSimplifyResponse> {
  const token = getToken();
  if (token?.startsWith("mock-")) {
    const daily = parseInt(localStorage.getItem("mock-usage-daily") || "0") + 1;
    localStorage.setItem("mock-usage-daily", String(daily));

    const eventsJson = localStorage.getItem("mock-user-events");
    const events = eventsJson ? JSON.parse(eventsJson) : [];
    events.unshift({
      id: Date.now(),
      actionType: "image_simplify",
      units: 1,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem("mock-user-events", JSON.stringify(events));

    return {
      transcription: "This is a simulated OCR transcription of your uploaded screenshot.",
      simplifiedText: "This is a simplified version of the text extracted from the screenshot, presented at the requested reading level.",
      status: "success",
    };
  }

  const mappedReq = {
    ...req,
    outputStyle: mapProfileToOutputStyle(req.outputStyle)
  };

  const response = await fetch(`${getSimplifyUrl()}/transcribe-and-simplify`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(mappedReq),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to transcribe and simplify image");
  }
  return response.json();
}

export async function transcribeImage(imageBase64: string): Promise<{ transcription: string; status: string }> {
  const token = getToken();
  if (token?.startsWith("mock-")) {
    return {
      transcription: "This is a simulated OCR transcription of your uploaded image.",
      status: "success",
    };
  }

  const response = await fetch(`${getSimplifyUrl()}/transcribe`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ imageBase64 }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to transcribe image");
  }
  return response.json();
}
