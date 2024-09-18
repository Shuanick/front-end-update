import { React, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Postpage({ imagePreview, handleModalClose, imageFile, resetImage,addNewPost }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClick = (event) => {
    event.stopPropagation();
    handleModalClose(event);
  };

  const handleSubmit = async () => {
    if (!content) {
      alert("內容不可為空白");
      return;
    }

    setLoading(true);
    let imagePath = null;
    try {
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append("image", imageFile); // Append the image file
        const imageResponse = await axios.post(
          "https://nickproduct-d61b16cc0f17.herokuapp.com/upload",//
          imageFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data", // Specify that this is a form-data request
            },
          }
        );
        imagePath = imageResponse.data.imagePath; // Assuming the server responds with the image URL
        if (imagePath) {
          resetImage();
        }
      }

      const postFormData = new FormData();
      postFormData.append("content", content);
      if (imagePath) {
        postFormData.append("image", imagePath); // Append the image URL
      }

      const response = await axios.post(
        "https://nickproduct-d61b16cc0f17.herokuapp.com/posts",//
        postFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Specify that this is a form-data request
          },
        }
      );
      console.log("Post created:", response.data);
      // 清除內容和關閉模態框
      setContent("");
      handleModalClose();
      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="notlist2" onClick={handleClick}>
      <div className="post-container">
        <div className="post-header">建立新貼文</div>
        <div className="prepost">
          <div className="picture">
            <img src={imagePreview} alt="Preview" />
          </div>
          <div className="text">
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
              type="text"
              className="type-in"
              placeholder="留下你想說的話..."
            />
            <div className="submit">
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={loading}//
              >
                {loading ? "提交中..." : "提交"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Postpage;
