import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

export function PuterScriptLoader() {
  const { init } = usePuterStore();
  const [scriptError, setScriptError] = useState<string | null>(null);

  // Dynamically load Puter script so we can surface load errors
  useEffect(() => {
    let isMounted = true;
    const script = document.createElement("script");
    script.src = "https://js.puter.com/v2/";
    script.async = true;
    script.onload = () => {
      if (isMounted) {
        setScriptError(null);
      }
    };
    script.onerror = () => {
      console.error("Failed to load Puter.js");
      if (isMounted) {
        setScriptError("Unable to connect to Puter. Please refresh the page.");
      }
    };
    document.body.appendChild(script);

    // Kick off Puter polling immediately; init() will set an error if Puter never appears.
    init();

    return () => {
      isMounted = false;
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [init]);

  if (!scriptError) return null;

  return (
    <div className="bg-red-100 text-red-900 text-sm px-4 py-2">
      {scriptError}
    </div>
  );
}
