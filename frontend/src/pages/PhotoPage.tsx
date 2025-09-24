import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { 
  Loader2, 
  Images, 
  ArrowLeft, 
  Edit3, 
  Save, 
  X, 
  ImageOff,
  Check 
} from "lucide-react";
import { Badge } from "../components/ui/badge";

interface Photo {
  id: number;
  title: string;
  imageUrl: string;
  albumId: number;
}

const PhotoPage = () => {
  const { id } = useParams<{ id: string }>();
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const navigate = useNavigate();

  // Function to convert placeholder URLs (same as AlbumPage)
  const getWorkingImageUrl = (originalUrl: string, photoId: number) => {
    if (originalUrl.includes('via.placeholder.com')) {
      const dimensions = originalUrl.match(/\/(\d+)/)?.[1] || '800';
      return `https://picsum.photos/${dimensions}/${dimensions}?random=${photoId}`;
    }
    
    if (originalUrl.includes('placeholder.com') || originalUrl.includes('placehold')) {
      return `https://picsum.photos/800/800?random=${photoId}`;
    }
    
    return originalUrl;
  };

  useEffect(() => {
    if (!id) {
      setError("Photo ID not found");
      setLoading(false);
      return;
    }

    const fetchPhoto = async () => {
      try {
        console.log(`Fetching photo with ID: ${id}`);
        const response = await axios.get(`http://localhost:4000/api/photos/${id}`);
        console.log("Fetched photo:", response.data);
        setPhoto(response.data);
        setEditedTitle(response.data.title);
      } catch (err: any) {
        console.error("Error fetching photo:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPhoto();
  }, [id]);

  const handleSaveTitle = async () => {
    if (!photo || !editedTitle.trim()) return;

    setSaving(true);
    try {
      console.log(`Updating photo ${photo.id} title to: ${editedTitle}`);
      
      // Send PATCH request to update the title
      const response = await axios.patch(`http://localhost:4000/api/photos/${photo.id}`, {
        title: editedTitle.trim()
      });

      console.log("Update response:", response.data);
      
      // Update local state
      setPhoto({ ...photo, title: editedTitle.trim() });
      setIsEditing(false);
      setSaveSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);

    } catch (err: any) {
      console.error("Error updating photo title:", err);
      setError(`Failed to update title: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedTitle(photo?.title || "");
    setIsEditing(false);
  };

  const handleImageError = () => {
    console.log(`Image failed to load for photo ID: ${id}`);
    setImageError(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="shadow-xl p-8">
          <div className="flex items-center space-x-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-gray-700 text-lg">Loading photo...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="shadow-xl p-8 max-w-md">
          <p className="text-red-600 text-lg text-center mb-4">Error: {error}</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => navigate(-1)} variant="outline">
              Go Back
            </Button>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!photo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="shadow-xl p-8">
          <p className="text-gray-700 text-lg text-center mb-4">Photo not found</p>
          <Button onClick={() => navigate(-1)} className="w-full">
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Images className="h-8 w-8 text-slate-50" />
          <span className="text-2xl font-bold text-slate-50">PhotoAlbums</span>
        </div>
        <div className="flex items-center space-x-2">
          {saveSuccess && (
            <Badge className="bg-green-500 text-white">
              <Check className="h-3 w-3 mr-1" />
              Saved!
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-900 border-gray-200 hover:border-gray-300"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="bg-blue-700 border-2 border-white shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              {isEditing ? (
                <div className="flex items-center space-x-2 flex-1">
                  <Input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="flex-1 bg-white"
                    placeholder="Enter photo title..."
                    maxLength={200}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveTitle();
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                  />
                  <Button 
                    size="sm" 
                    onClick={handleSaveTitle}
                    disabled={saving || !editedTitle.trim()}
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleCancelEdit}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-900"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <CardTitle className="text-2xl text-slate-50 flex-1">
                    {photo.title}
                  </CardTitle>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="bg-purple-200 hover:bg-purple-300 text-purple-700 border-purple-200"
                  >
                    <Edit3 className="h-4 w-4 mr-1" /> Edit Title
                  </Button>
                </div>
              )}
            </div>
            
          </CardHeader>
          
          <CardContent>
            <div className="flex justify-center">
              {imageError ? (
                <div className="w-full max-w-2xl h-96 bg-gray-300 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-600">
                    <ImageOff className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-lg font-semibold mb-2">Image failed to load</p>
                    <p className="text-sm break-all px-4">{photo.imageUrl}</p>
                  </div>
                </div>
              ) : (
                <img
                  src={getWorkingImageUrl(photo.imageUrl, photo.id)}
                  alt={photo.title}
                  className="max-w-full max-h-96 object-contain rounded-lg shadow-lg"
                  onError={handleImageError}
                  onLoad={() => console.log(`Image loaded successfully for photo ID: ${photo.id}`)}
                />
              )}
            </div>
            
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PhotoPage;