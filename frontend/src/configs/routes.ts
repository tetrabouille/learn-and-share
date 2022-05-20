import BuildAssets from '@/pages/BuildAssets.svelte';
import Home from '@/pages/Home.svelte';
import KnowledgeAssets from '@/pages/KnowledgeAssets.svelte';
import Login from '@/pages/Login.svelte';
import NewStory from '@/pages/NewStory.svelte';
import Profile from '@/pages/Profile.svelte';
import Signup from '@/pages/Signup.svelte';
import Stories from '@/pages/Stories.svelte';

export type RouteConfig = {
  path: string;
  component: any;
  requireLogin?: boolean;
  linkPositions?: string[];
  title?: string;
  roles?: string[];
};

export const routeConfigs: readonly RouteConfig[] = Object.freeze([
  {
    path: '/',
    component: Home,
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/signup',
    component: Signup,
  },
  {
    path: '/stories',
    component: Stories,
    linkPositions: ['header'],
    title: 'Stories',
  },
  {
    path: '/knowledge-assets',
    component: KnowledgeAssets,
    linkPositions: ['header'],
    title: 'Knowledge Assets',
  },
  {
    path: '/new-story',
    component: NewStory,
    linkPositions: ['header'],
    title: 'New Story',
    requireLogin: true,
  },
  {
    path: '/build-assets',
    component: BuildAssets,
    linkPositions: ['header'],
    title: 'Build Assets',
    roles: ['user'],
    requireLogin: true,
  },
  {
    path: '/profile',
    component: Profile,
    requireLogin: true,
  },
]);
