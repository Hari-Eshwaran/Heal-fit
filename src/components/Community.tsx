import React, { useState } from 'react';
import { MessageSquare, Heart, Share2, Flag, Send, Search, Filter, TrendingUp, Award, Users } from 'lucide-react';
import { format } from 'date-fns';

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  timestamp: number;
  isLiked: boolean;
  isSaved: boolean;
}

const mockPosts: Post[] = [
  {
    id: '1',
    author: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      role: 'Survivor'
    },
    content: "After battling chronic migraines for years, I finally found relief through a combination of lifestyle changes and proper medication. It wasn't an easy journey, but I learned so much about triggers and management techniques. Happy to share my experience with anyone going through similar challenges. #ChronicMigraines #HealthJourney",
    tags: ['ChronicMigraines', 'HealthJourney', 'Support'],
    likes: 128,
    comments: 32,
    shares: 15,
    timestamp: Date.now() - 3600000,
    isLiked: false,
    isSaved: false
  },
  {
    id: '2',
    author: {
      name: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      role: 'Recovery Warrior'
    },
    content: "Today marks 1 year since my successful heart surgery. The recovery process was challenging, but the support from this community made a huge difference. Remember, it's okay to take things one day at a time. Your strength will build gradually. #HeartHealth #Recovery",
    tags: ['HeartHealth', 'Recovery', 'Inspiration'],
    likes: 256,
    comments: 45,
    shares: 28,
    timestamp: Date.now() - 7200000,
    isLiked: false,
    isSaved: false
  },
  {
    id: '3',
    author: {
      name: 'Emily Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
      role: 'Mental Health Advocate'
    },
    content: "Living with anxiety isn't easy, but I've learned valuable coping mechanisms that I want to share. Deep breathing exercises, regular exercise, and therapy have been game-changers for me. Remember, seeking help is a sign of strength, not weakness. #MentalHealth #AnxietyAwareness",
    tags: ['MentalHealth', 'AnxietyAwareness', 'Wellness'],
    likes: 189,
    comments: 56,
    shares: 42,
    timestamp: Date.now() - 10800000,
    isLiked: false,
    isSaved: false
  },
  {
    id: '4',
    author: {
      name: 'David Thompson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      role: 'Diabetes Fighter'
    },
    content: "Managing Type 2 Diabetes seemed overwhelming at first, but with proper diet, exercise, and medication, it's become manageable. Here's what I've learned about blood sugar control and healthy eating habits. Always consult your doctor before making major changes. #DiabetesManagement",
    tags: ['DiabetesManagement', 'HealthyLiving', 'Nutrition'],
    likes: 145,
    comments: 38,
    shares: 19,
    timestamp: Date.now() - 14400000,
    isLiked: false,
    isSaved: false
  }
];

const trendingTopics = [
  { tag: 'ChronicPainSupport', posts: 1234 },
  { tag: 'MentalHealthAwareness', posts: 956 },
  { tag: 'RecoveryJourney', posts: 845 },
  { tag: 'AutoimmuneWarriors', posts: 732 },
  { tag: 'HeartHealthTips', posts: 654 }
];

const Community: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [newPost, setNewPost] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLike = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              isLiked: !post.isLiked
            }
          : post
      )
    );
  };

  const handleSave = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, isSaved: !post.isSaved }
          : post
      )
    );
  };

  const handleSubmitPost = () => {
    if (!newPost.trim()) return;

    const post: Post = {
      id: Date.now().toString(),
      author: {
        name: 'Current User',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
        role: 'Member'
      },
      content: newPost,
      tags: newPost.match(/#\w+/g)?.map(tag => tag.slice(1)) || [],
      likes: 0,
      comments: 0,
      shares: 0,
      timestamp: Date.now(),
      isLiked: false,
      isSaved: false
    };

    setPosts([post, ...posts]);
    setNewPost('');
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTags = selectedTags.length === 0 ||
                       selectedTags.some(tag => post.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Post */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Share Your Story</h2>
            <div className="space-y-4">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share your medical journey, challenges, or success story..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows={4}
              />
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Use #hashtags to categorize your post
                </p>
                <button
                  onClick={handleSubmitPost}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Share Story
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search stories..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
              <button className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
            </div>
          </div>

          {/* Posts */}
          <div className="space-y-6">
            {filteredPosts.map(post => (
              <div key={post.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">{post.author.name}</h3>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500">
                        {format(post.timestamp, 'MMM d, yyyy')}
                      </span>
                      <span className="mx-2 text-gray-500">•</span>
                      <span className="text-sm bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                        {post.author.role}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-800 mb-4">{post.content}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-full hover:bg-gray-200 cursor-pointer"
                      onClick={() => setSelectedTags(prev =>
                        prev.includes(tag)
                          ? prev.filter(t => t !== tag)
                          : [...prev, tag]
                      )}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                      post.isLiked
                        ? 'text-red-600 bg-red-50'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                    {post.likes}
                  </button>

                  <button className="flex items-center gap-2 px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-50">
                    <MessageSquare className="w-5 h-5" />
                    {post.comments}
                  </button>

                  <button className="flex items-center gap-2 px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-50">
                    <Share2 className="w-5 h-5" />
                    {post.shares}
                  </button>

                  <button
                    onClick={() => handleSave(post.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                      post.isSaved
                        ? 'text-indigo-600 bg-indigo-50'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Flag className="w-5 h-5" />
                    {post.isSaved ? 'Saved' : 'Save'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Community Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 text-indigo-600 mr-2" />
              Community Stats
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-indigo-50 rounded-lg">
                <p className="text-2xl font-bold text-indigo-600">5.2K</p>
                <p className="text-sm text-gray-600">Members</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">1.8K</p>
                <p className="text-sm text-gray-600">Stories Shared</p>
              </div>
            </div>
          </div>

          {/* Trending Topics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 text-indigo-600 mr-2" />
              Trending Topics
            </h2>
            <div className="space-y-3">
              {trendingTopics.map((topic, index) => (
                <div
                  key={topic.tag}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                  onClick={() => setSelectedTags(prev =>
                    prev.includes(topic.tag)
                      ? prev.filter(t => t !== topic.tag)
                      : [...prev, topic.tag]
                  )}
                >
                  <div className="flex items-center">
                    <span className="text-indigo-600 font-medium mr-2">#{index + 1}</span>
                    <span className="text-gray-800">#{topic.tag}</span>
                  </div>
                  <span className="text-sm text-gray-500">{topic.posts} posts</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Contributors */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="w-5 h-5 text-indigo-600 mr-2" />
              Top Contributors
            </h2>
            <div className="space-y-4">
              {mockPosts.slice(0, 3).map(post => (
                <div key={post.id} className="flex items-center">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{post.author.name}</p>
                    <p className="text-sm text-gray-500">{post.author.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;