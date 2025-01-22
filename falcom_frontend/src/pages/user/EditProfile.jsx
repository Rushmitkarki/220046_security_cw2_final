import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  editUserProfileApi,
  getCurrentUserApi,
  uploadProfilePictureApi,
} from "../../apis/Api";
import { Navigate } from "react-router-dom";

const EditProfile = () => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    username: "",
    profilePicture: null,
  });

  useEffect(() => {
    getCurrentUserApi()
      .then((res) => {
        if (res.status === 200) {
          const userData = res.data.user;
          setProfile({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            username: userData.userName,
            profilePicture: userData.profilePicture,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to fetch user details");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    Navigate("/login", { replace: true });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only image files (JPEG, PNG, GIF) are allowed.");
        return;
      }

      const formData = new FormData();
      formData.append("profilePicture", file);

      uploadProfilePictureApi(formData)
        .then((res) => {
          if (res.status === 200) {
            toast.success(res.data.message);
            setProfile({ ...profile, profilePicture: res.data.profilePicture });
          } else {
            toast.error(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Failed to upload profile picture");
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedProfile = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      phoneNumber: profile.phoneNumber,
      userName: profile.username,
      profilePicture: profile.profilePicture,
    };

    editUserProfileApi(updatedProfile)
      .then((res) => {
        if (res.status === 200) {
          toast.success("Your profile has been updated successfully");
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to update profile");
      });
  };

  return (
    <div className="min-h-screen bg-gray-900 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-3xl sm:mx-auto w-full px-4">
        <div className="relative px-4 py-10 bg-gray-800 shadow-lg rounded-3xl sm:p-10">
          <form className="max-w-md mx-auto space-y-6" onSubmit={handleSubmit}>
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Edit Profile
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Profile Image
              </label>
              <div className="mt-1 flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {profile.profilePicture ? (
                    <img
                      src={`https://localhost:5000/profile_pictures/${profile.profilePicture}`}
                      alt="Profile"
                      className="h-20 w-20 rounded-full object-cover border-2 border-red-500"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-gray-600 flex items-center justify-center border-2 border-red-500">
                      <svg
                        className="h-10 w-10 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  )}
                </div>
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-gray-700 py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
                >
                  <span>Change</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </label>
              </div>
            </div>

            {["username", "firstName", "lastName", "email", "phoneNumber"].map(
              (field) => (
                <div key={field}>
                  <label
                    htmlFor={field}
                    className="block text-sm font-medium text-gray-300 capitalize"
                  >
                    {field.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    id={field}
                    value={profile[field]}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    placeholder={field.replace(/([A-Z])/g, " $1").trim()}
                  />
                </div>
              )
            )}

            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
              >
                Update Profile
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out"
              >
                Logout
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
