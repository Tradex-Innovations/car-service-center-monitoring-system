export type PlateDetectionResult = {
  plateNumber: string;
  confidence: number;
  rawText: string;
  provider: string;
  detectedAt: string;
};

const mockPlates = ["CAB-4589", "WP-CAR-2211", "ABC-1234", "CAA-7788", "KI-9090", "CAR-6021", "WP-KD-8841"];

export async function detectPlateFromImage(_file?: File | Blob | null): Promise<PlateDetectionResult> {
  await new Promise((resolve) => setTimeout(resolve, 850));
  const plateNumber = mockPlates[Math.floor(Math.random() * mockPlates.length)];
  const confidence = Math.floor(84 + Math.random() * 13);

  // Real ANPR integration belongs here. Replace the mock result with a call to
  // Plate Recognizer, OpenALPR, a custom YOLO+OCR pipeline, or a Python FastAPI
  // microservice while keeping this return contract stable for the UI.
  return {
    plateNumber,
    confidence,
    rawText: plateNumber.replace("-", " "),
    provider: "Mock ANPR Prototype",
    detectedAt: new Date().toISOString()
  };
}
