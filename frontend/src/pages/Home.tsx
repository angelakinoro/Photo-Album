// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from "../components/ui/button"; 
// import { LogOut } from 'lucide-react';
// import { signOut } from 'firebase/auth';
// import { auth } from "../firebase"; // Make sure this path is correct to your firebase config

// const Home = () => {
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   // Function to handle the logout process
//   const handleLogout = async () => {
//     setLoading(true);
//     try {
//       console.log("Attempting to sign out...");
//       await signOut(auth);
//       console.log("Sign out successful");
      
//       // Navigate to login page after successful logout
//       navigate('/login');
//     } catch (error) {
//       console.error("Logout failed:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 space-y-6">
//       <div className="text-center">
//         <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to the Home Page!</h1>
//         <p className="text-lg text-gray-600">You are successfully logged in.</p>
//       </div>
      
//       {/* Logout Button */}
//       <Button
//         onClick={handleLogout}
//         disabled={loading}
//         className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2"
//         size="lg"
//       >
//         <span>{loading ? "Signing out..." : "Sign Out"}</span>
//         {loading ? (
//           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//         ) : (
//           <LogOut className="h-4 w-4" />
//         )}
//       </Button>
//     </div>
//   );
// };

// export default Home;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Loader2, Images, User, Album, Mail } from "lucide-react";


interface User{
    id: number;
    name: string;
    username: string;
    email: string;
}

interface Album{
    id: number;
    userId: number;
    title: string;
}

const Home = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;


    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error("Logout failed")
        }
    }

    const handleUserClick = (userId: number) => {
        navigate(`/users/${userId}`);
    }

    useEffect(()=>{
        const fetchData = async () => {
            try {
                const [usersRes, albumsRes] = await Promise.all([
                    axios.get(`${API_URL}/api/users`),
                    axios.get(`${API_URL}/api/albums`),
                ]);
                setUsers(usersRes.data);
                setAlbums(albumsRes.data);
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading (false)
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="flex items-center justify-center min-h-screen">
                    <Card className="shadow-xl p-8">
                        <div className="flex items-center space-x-4">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                            <p className="text-gray-700 text-lg">Loading users...</p>
                        </div>
                    </Card>
                </div>
             </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="flex items-center justify-center min-h-screen">
                    <Card className="shadow-xl p-8">
                        <p className="text-red-600 text-lg text-center">
                        Error: {error}
                        </p>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-blue-900">
            { /* Header with sign out */}
            <header className='container mx-auto px-4 py-6'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2 ml-10'>
                    <Images className='h-8 w-8 text-slate-50'/>
                    <span className='text-2xl font-bold text-slate-50'>PhotoAlbums</span>
                </div>

                <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="bg-red-500 hover:bg-red-600 text-white border-red-500 hover:border-red-600"
                >
                    Sign Out
                </Button>
            </div>
        </header>

        {/* Users Grid */}
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-center mb-10 text-3xl md:text-4xl font-bold text-slate-50"> Discover Users </h1>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {users.map((user)=>{
                    const albumCount = albums.filter((a)=> a.userId === user.id).length;
                    return (
                        <Card 
                            key={user.id}
                            className="shadow-md hover:shadow-lg transition-all duration-300 group border-2 border-white bg-blue-700"
                            onClick={()=> handleUserClick(user.id)}
                        >
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-3 bg-blue-100 rounded-4xl">
                                        <User className="h-6 w-6 text-blue-600"/>
                                    </div>
                                    
                                    <Badge
                                        variant="secondary"
                                        className="bg-purple-100 text-purple-700"
                                    >
                                        <Album className="h-3 w-3 mr-1"/>
                                        {albumCount}
                                    </Badge>
                                </div>

                                <CardTitle className="text-xl group-hover: text-slate-50 transition-colors"> {user.name}</CardTitle>
                                <CardDescription className="text-slate-100">@{user.username}</CardDescription>
                            </CardHeader>

                            <CardContent>
                                <div className="flex items-center space-x-2 text-gray-300
                                 mb-4">
                                    <Mail className="h-4 w-4"/>
                                    <span className="text-sm">{user.email}</span>
                                </div>
                                <p className="text-purple-200 font-medium">
                                    {albumCount} {albumCount === 1? "album" : "albums"}
                                </p>
                            </CardContent>

                        </Card>
                    )
                })}
            </div>
        </div>
        </div>
    )
    
}

export default Home;