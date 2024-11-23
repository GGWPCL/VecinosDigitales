import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Card, CardContent } from '@/Components/ui/card';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Button } from '@/Components/ui/button';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog";

interface Post {
    id: number;
    title: string;
    content: string;
    category: string;
    author: string;
    votes: number;
    comments: number;
    createdAt: string;
}

interface Category {
    name: string;
    internal_name: string;
    icon: string;
}

interface Props {
    community: {
        name: string;
        isMember: boolean;
    };
    auth: { user: any };
    categories: Category[];
    posts: Post[];
}

export default function Show({ community, auth, categories, posts }: Props) {
    const [showCategoryModal, setShowCategoryModal] = useState(false);

    const [currentCategory, setCurrentCategory] = useState<string | undefined>(
        (usePage().props as { category?: string }).category
    );

    const isMember = (usePage().props as { community?: { isMember: boolean } }).community?.isMember;

    useEffect(() => {
        const category = new URLSearchParams(window.location.search).get('category');
        setCurrentCategory(category || undefined);
    }, []);

    const handleCategoryClick = (internal_name?: string) => {
        setCurrentCategory(internal_name);

        router.get(
            route(route().current() ?? '', { ...route().params }),
            { category: internal_name },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const Layout = auth.user ? AuthenticatedLayout : GuestLayout;
    
    const handleCreatePost = (category: string) => {
        router.visit(route('posts.create', { 
            community: route().params.community,
            category: category 
        }));
    };

    return (
        <Layout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    {community?.name || "Comunidad"}
                </h2>
            }
        >
            <Head title={`${community?.name || 'Comunidad'} - Open Comunidad`} />

            {/* Guest warning banner */}
            {!auth.user && (
                <div className="bg-amber-50 border-b border-amber-100">
                    <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
                        <p className="text-sm text-amber-700">
                            Estás viendo una versión limitada del contenido. Inicia sesión para ver todas las publicaciones y participar en la comunidad
                        </p>
                    </div>
                </div>
            )}

            {/* Non-member warning banner */}
            {auth.user && !isMember && (
                <div className="bg-amber-50 border-b border-amber-100">
                    <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
                        <p className="text-sm text-amber-700">
                            No eres miembro de esta comunidad. Estás viendo una versión limitada del contenido. Contacta con un administrador para unirte y participar en la comunidad.
                        </p>
                    </div>
                </div>
            )}

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex gap-6">
                        {/* Sidebar */}
                        <div className="w-64 shrink-0">
                            <Card>
                                <ScrollArea className="h-[calc(100vh-12rem)]">
                                    <div className="p-4 space-y-2">
                                        <Button
                                            key={undefined}
                                            variant="ghost"
                                            className={`w-full justify-start ${!currentCategory
                                                ? 'bg-primary/10 text-primary'
                                                : ''
                                                }`}
                                            onClick={() => handleCategoryClick()}
                                        >
                                            <span className="mr-2">📋</span>
                                            Todo
                                        </Button>
                                        {categories.map((category) => (
                                            <Button
                                                key={category.internal_name}
                                                variant="ghost"
                                                className={`w-full justify-start ${category.internal_name === currentCategory
                                                    ? 'bg-primary/10 text-primary'
                                                    : ''
                                                    }`}
                                                onClick={() => handleCategoryClick(category.internal_name)}
                                            >
                                                <span className="mr-2">{category.icon}</span>
                                                {category.name}
                                            </Button>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </Card>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 space-y-4">
                            <Dialog open={showCategoryModal} onOpenChange={setShowCategoryModal}>
                                <DialogContent className="sm:max-w-[600px]">
                                    <DialogHeader>
                                        <DialogTitle>Elige un tipo de publicación</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                                        {categories.filter(cat => cat.internal_name !== 'all').map((category) => (
                                            <Button
                                                key={category.internal_name}
                                                variant="outline"
                                                className="h-auto p-4 flex flex-col items-center text-center space-y-2 w-full"
                                                onClick={() => handleCreatePost(category.internal_name)}
                                            >
                                                <div className="text-2xl">{category.icon}</div>
                                                <div className="font-semibold">{category.name}</div>
                                                <div className="text-sm text-gray-500 whitespace-normal w-full">Pending: category description</div>
                                            </Button>
                                        ))}
                                    </div>
                                </DialogContent>
                            </Dialog>

                            <Button 
                                className="w-full" 
                                onClick={() => setShowCategoryModal(true)}
                            >
                                Crear nueva publicación
                            </Button>
                            
                            {/* Posts List */}
                            <div className="space-y-4">
                                {posts.map((post) => (
                                    <Card key={post.id} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-6">
                                            <div className="flex gap-4">
                                                {/* Votes */}
                                                <div className="flex flex-col items-center space-y-1">
                                                    <Button variant="ghost" size="sm">▲</Button>
                                                    <span className="text-sm font-medium">{post.votes}</span>
                                                    <Button variant="ghost" size="sm">▼</Button>
                                                </div>

                                                {/* Post Content */}
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                                                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                                                            {post.category}
                                                        </span>
                                                        <span>• Posted by {post.author}</span>
                                                        <span>• {post.createdAt}</span>
                                                    </div>
                                                    <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                                                    <p className="text-gray-600 mb-4">{post.content}</p>
                                                    <div className="flex items-center space-x-4">
                                                        <Button variant="ghost" size="sm">
                                                            💬 {post.comments} Comments
                                                        </Button>
                                                        <Button variant="ghost" size="sm">
                                                            Share
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}