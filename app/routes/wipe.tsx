import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

const WipeApp = () => {
  const { auth, isLoading, error, fs, kv } = usePuterStore();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FSItem[]>([]);

  const loadFiles = async () => {
    try {
      const files = (await fs.readDir("./")) as FSItem[];
      setFiles(files || []);
    } catch (error) {
      console.error("Failed to load files:", error);
      setFiles([]);
    }
  };

  useEffect(() => {
    if (!fs) return;
    loadFiles();
  }, [fs]);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/wipe");
    }
  }, [isLoading, auth.isAuthenticated, navigate]);

  const handleDelete = async () => {
    try {
      await Promise.all(files.map((file) => fs.delete(file.path)));
      await kv.flush();
      await loadFiles();
    } catch (error) {
      console.error("Failed to delete files:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error {error}</div>;
  }

  return (
    <div>
      Authenticated as: {auth.user?.username}
      <div>Existing files:</div>
      <div className="flex flex-col gap-4">
        {files.map((file) => (
          <div key={file.id} className="flex flex-row gap-4">
            <p>{file.name}</p>
          </div>
        ))}
      </div>
      <div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
          onClick={() => {
            if (
              window.confirm(
                "Are you sure you want to wipe all app data? This action cannot be undone."
              )
            ) {
              handleDelete();
            }
          }}
        >
          Wipe App Data
        </button>
      </div>
    </div>
  );
};

export default WipeApp;
