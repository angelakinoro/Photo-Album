import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Loader2, Images, Album, Mail, User as UserIcon, ArrowLeft} from "lucide-react";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

interface Album {
  id: number;
  userId: number;
  title: string;
}

const UserPage = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL ||  "http://localhost:4000";


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, albumsRes] = await Promise.all([
          axios.get(`${API_URL}/api/users/${id}`),
          axios.get(`${API_URL}/api/albums/user/${id}`),
        ]);
        setUser(userRes.data);
        setAlbums(albumsRes.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="shadow-xl p-8">
          <div className="flex items-center space-x-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-gray-700 text-lg">Loading user...</p>
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
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-900">
        <p className="text-slate-50 text-xl">User not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2 ml-10">
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

      {/* User Info */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="bg-blue-700 border-2 border-white shadow-lg mb-10">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <UserIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl text-slate-50">{user.name}</CardTitle>
                <CardDescription className="text-slate-100">@{user.username}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 text-gray-300">
              <Mail className="h-4 w-4" />
              <span className="text-sm">{user.email}</span>
            </div>
          </CardContent>
        </Card>

        {/* Albums */}
        <h2 className="text-2xl font-bold text-slate-50 mb-6">Albums</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => (
            <Card
              key={album.id}
              className="shadow-md hover:shadow-lg transition-all duration-300 group border-2 border-white bg-blue-700 cursor-pointer"
              onClick={() => navigate(`/albums/${album.id}`)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Album className="h-6 w-6 text-purple-700" />
                  </div>
                  <Badge variant="secondary" className="bg-purple-200 text-purple-700">
                    Album
                  </Badge>
                </div>
                <CardTitle className="text-lg text-purple-200">
                  {album.title}
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
