import { PhotoIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { toast } from "sonner";

export default function SearchByImage({
  searchPalette = false,
  setIsOpen,
  setData,
  setMedia,
}) {
  const router = useRouter();

  async function findImage(formData) {
    const response = new Promise((resolve, reject) => {
      fetch("https://api.trace.moe/search?anilistInfo", {
        method: "POST",
        body: formData,
      })
        .then((resp) => {
          resolve(resp.json());
        })
        .catch((error) => {
          reject(error);
        });
    });

    toast.promise(response, {
      loading: "Finding episodes...",
      success: `Episodes found!`,
      error: "Error",
    });

    response
      .then((data) => {
        if (data?.result?.length > 0) {
          const id = data.result[0].anilist.id;
          const datas = data.result.filter((i) => i.anilist.isAdult === false);
          if (setData) setData(datas);
          if (searchPalette) router.push(`/en/anime/${id}`);
          if (setIsOpen) setIsOpen(false);
          if (setMedia) setMedia();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  const handleImageSelect = async (e) => {
    const selectedImage = e.target.files[0];

    if (selectedImage) {
      const formData = new FormData();
      formData.append("image", selectedImage);

      try {
        await findImage(formData);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }
  };

  useEffect(() => {
    // Add a global event listener for the paste event
    const handlePaste = async (e) => {
      e.preventDefault();

      const items = e.clipboardData.items;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const blob = items[i].getAsFile();

          // Create a FormData object and append the pasted image
          const formData = new FormData();
          formData.append("image", blob);

          try {
            // Send the pasted image to your API for processing
            await findImage(formData);
          } catch (error) {
            console.error("An error occurred:", error);
          }
          break; // Stop after finding the first image
        }
      }
    };

    // Add the event listener to the document
    document.addEventListener("paste", handlePaste);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("paste", handlePaste);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <label
        className={`${
          searchPalette ? "w-9 h-9" : "py-2 px-2"
        } bg-secondary rounded flex justify-center items-center cursor-pointer hover:bg-opacity-75 transition-all duration-100 group`}
      >
        <PhotoIcon className="w-6 h-6" />
        <input
          type="file"
          name="image"
          onChange={handleImageSelect}
          className="hidden"
        />
      </label>
    </div>
  );
}
