import { EventFormData } from "@/app/types/EventForm";
import { RefreshCw, Wand2, X, Check } from "lucide-react";
import { useEffect, useState, useRef } from "react";

export default function EnhancedDescriptionInput({
  formData,
  setFormData,
  textareaClasses,
}: {
  formData: EventFormData;
  setFormData: React.Dispatch<React.SetStateAction<EventFormData>>;
  textareaClasses: string;
}) {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalDescription, setOriginalDescription] = useState<string | null>(null);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const typeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTypingInterval = () => {
    if (typeIntervalRef.current) {
      clearInterval(typeIntervalRef.current);
      typeIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearTypingInterval();
  }, []);

  const cancelEnhancement = () => {
    clearTypingInterval();
    setIsEnhancing(false);
    setIsTypingComplete(false);
    
    if (originalDescription !== null) {
      setFormData(prev => ({
        ...prev,
        description: originalDescription
      }));
      setOriginalDescription(null);
    }
  };

  const acceptEnhancement = () => {
    setIsEnhancing(false);
    setIsTypingComplete(false);
    setOriginalDescription(null);
  };

  const typeOutText = (text: string) => {
    setOriginalDescription(formData.description ?? null);
    
    let index = 0;
    clearTypingInterval();

    setFormData(prev => ({
      ...prev,
      description: ""
    }));

    typeIntervalRef.current = setInterval(() => {
      setFormData(prev => ({
        ...prev,
        description: text.slice(0, index + 1)
      }));

      index++;

      if (index >= text.length) {
        clearTypingInterval();
        setIsTypingComplete(true);
      }
    }, 30);
  };

  const enhanceDescription = async () => {
    if (!formData.title?.trim() || !formData.location) {
      setError("Please enter all previous event data first");
      return;
    }

    if (!formData.description) {
      setError("Please enter an initial description first");
      return;
    }

    setIsTypingComplete(false);
    setIsEnhancing(true);
    setError(null);

    try {
      const response = await fetch("/api/generateDescription", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          eventType: formData.type,
          description: formData.description
        }),
      });

      if (!response.ok) throw new Error("Failed to enhance description");

      const { description } = await response.json();
      typeOutText(description);
    } catch (error) {
      console.error("Error enhancing description:", error);
      setError("Failed to enhance description. Please try again.");
      cancelEnhancement();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description<span className="text-accent ml-1">*</span>
        </label>

        <div className="flex gap-2">
          {isEnhancing && (
            <button
              type="button"
              onClick={cancelEnhancement}
              className="flex items-center gap-2 px-3 py-1.5 rounded text-sm
                       bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          )}
          
          {isTypingComplete ? (
            <button
              type="button"
              onClick={acceptEnhancement}
              className="flex items-center gap-2 px-3 py-1.5 rounded text-sm
                       bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
            >
              <Check className="w-4 h-4" />
              Accept Changes
            </button>
          ) : (
            <button
              type="button"
              onClick={enhanceDescription}
              disabled={isEnhancing || !formData.description}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm ${
                isEnhancing || !formData.description
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-50 text-blue-600 hover:bg-blue-100"
              } transition-colors`}
            >
              {isEnhancing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Enhancing...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  Enhance with AI
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <textarea
        id="description"
        value={formData.description || ""}
        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        rows={4}
        minLength={100}
        maxLength={1000}
        className={textareaClasses}
        placeholder="Describe your event (minimum 100 characters and max 1000)"
        required
      />

      <div className="flex justify-between items-start">
        <p className={`text-sm ${error ? "text-red-500" : "text-gray-500"}`}>
          {error ||
            (formData.description
              ? `${formData.description.length} / 1000 characters ${
                  formData.description.length < 100
                    ? `(${100 - formData.description.length} more needed)`
                    : ""
                }`
              : "0 / 1000 characters (100 more needed)")}
        </p>
        {formData.description && formData.description.length > 0 && (
          <p className="text-sm text-gray-500">
            {isEnhancing ? "Generating enhanced description..." : "Edit the description as needed"}
          </p>
        )}
      </div>
    </div>
  );
}