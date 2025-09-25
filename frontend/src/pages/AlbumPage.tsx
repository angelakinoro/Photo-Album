import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Loader2, Images, ArrowLeft, ImageOff } from "lucide-react";
import { Button } from "../components/ui/button";

interface Photo {
  id: number;
  title: string;
  imageUrl: string;
  albumId: number;
}

const AlbumPage = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Add guard clause
    if (!albumId) {
      setError("Album ID not found");
      setLoading(false);
      return;
    }

    const fetchPhotos = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/photos/album/${albumId}`);
        console.log("Fetched photos:", res.data); // Debug log
        setPhotos(res.data);
      } catch (err: any) {
        console.error("Error fetching photos:", err); // Debug log
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, [albumId]);

  const handleImageError = (photoId: number) => {
    console.log(`Image failed to load for photo ID: ${photoId}`); // Debug log
    setImageErrors(prev => new Set(prev).add(photoId));
  };

  const handleImageLoad = (photoId: number) => {
    console.log(`Image loaded successfully for photo ID: ${photoId}`); // Debug log
  };

  // Function to convert placeholder URLs to working ones or provide fallbacks
  const getWorkingImageUrl = (originalUrl: string, photoId: number) => {
    // If it's a via.placeholder.com URL, convert it to a working service
    if (originalUrl.includes('via.placeholder.com')) {
      const dimensions = originalUrl.match(/\/(\d+)/)?.[1] || '600';
      // Use picsum.photos which is more reliable
      return `https://picsum.photos/${dimensions}/${dimensions}?random=${photoId}`;
    }
    
    // For other placeholder services that might not work, also convert
    if (originalUrl.includes('placeholder.com') || originalUrl.includes('placehold')) {
      return `https://picsum.photos/600/600?random=${photoId}`;
    }
    
    // Return original URL if it's not a known placeholder service
    return originalUrl;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="shadow-xl p-8">
          <div className="flex items-center space-x-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-gray-700 text-lg">Loading photos...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="shadow-xl p-8">
          <p className="text-red-600 text-lg text-center">Error: {error}</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
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
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-900 border-gray-200 hover:border-gray-300"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
      </header>

      {/* Photos grid */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-center mb-10 text-3xl md:text-4xl font-bold text-slate-50">
          Album {albumId}
        </h1>

        {photos.length === 0 ? (
          <p className="text-center text-slate-200">No photos in this album.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {photos.map((photo) => (
              <Card
                key={photo.id}
                className="shadow-md hover:shadow-lg transition-all duration-300 border-2 border-white bg-blue-700"
                onClick={() => navigate(`/photos/${photo.id}`)}
              >
                <CardHeader>
                  <CardTitle className="text-slate-50 text-sm truncate">{photo.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {imageErrors.has(photo.id) ? (
                    // Show error state if image failed to load
                    <div className="w-full h-40 bg-gray-300 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-600">
                        <ImageOff className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-xs">Image failed to load</p>
                        <p className="text-xs mt-1 break-all">{photo.imageUrl}</p>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={getWorkingImageUrl(photo.imageUrl, photo.id)}
                      alt={photo.title}
                      className="w-full h-40 object-cover rounded-lg"
                      onError={() => handleImageError(photo.id)}
                      onLoad={() => handleImageLoad(photo.id)}
                      onLoadStart={() => console.log(`Started loading image for photo ID: ${photo.id}`)}
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumPage;