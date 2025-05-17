
'use server';

import type { GitHubUser, GitHubRepo, GitHubEvent } from '@/lib/types';

const GITHUB_API_BASE_URL = 'https://api.github.com';
// const GITHUB_TOKEN = process.env.GITHUB_PAT; // For higher rate limits if needed

const commonHeaders = {
  'Accept': 'application/vnd.github.v3+json',
  // ...(GITHUB_TOKEN && { 'Authorization': `token ${GITHUB_TOKEN}` }),
  'X-GitHub-Api-Version': '2022-11-28',
};

export async function getGithubUser(username: string): Promise<GitHubUser | null> {
  if (!username) {
    console.error('GitHub username cannot be empty.');
    return null;
  }
  try {
    const response = await fetch(`${GITHUB_API_BASE_URL}/users/${username}`, {
      headers: commonHeaders,
      next: { revalidate: 3600 } // Cache data for 1 hour
    });

    if (!response.ok) {
      console.error(`Failed to fetch GitHub user ${username}: ${response.status} ${response.statusText}`);
      const errorBody = await response.text();
      console.error('Error body:', errorBody);
      return null;
    }
    const data: GitHubUser = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching GitHub user ${username}:`, error);
    return null;
  }
}

export async function getGithubUserPublicRepos(username: string, perPage = 6, sort: 'created' | 'updated' | 'pushed' | 'full_name' = 'pushed'): Promise<GitHubRepo[]> {
  if (!username) {
    console.error('GitHub username cannot be empty for fetching repos.');
    return [];
  }
  try {
    const response = await fetch(`${GITHUB_API_BASE_URL}/users/${username}/repos?type=owner&sort=${sort}&per_page=${perPage}&direction=desc`, {
      headers: commonHeaders,
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!response.ok) {
      console.error(`Failed to fetch public repos for ${username}: ${response.status} ${response.statusText}`);
      return [];
    }
    const data: GitHubRepo[] = await response.json();
    return data.filter(repo => !repo.fork); // Filter out forks
  } catch (error) {
    console.error(`Error fetching public repos for ${username}:`, error);
    return [];
  }
}

export async function getGithubRepo(owner: string, repoName: string): Promise<GitHubRepo | null> {
  if (!owner || !repoName) {
    console.error('Owner and repository name cannot be empty for fetching a specific repo.');
    return null;
  }
  try {
    const response = await fetch(`${GITHUB_API_BASE_URL}/repos/${owner}/${repoName}`, {
      headers: commonHeaders,
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!response.ok) {
      console.error(`Failed to fetch GitHub repo ${owner}/${repoName}: ${response.status} ${response.statusText}`);
      const errorBody = await response.text();
      console.error('Error body:', errorBody);
      return null;
    }
    const data: GitHubRepo = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching GitHub repo ${owner}/${repoName}:`, error);
    return null;
  }
}


export async function getGithubUserEvents(username: string, perPage = 10): Promise<GitHubEvent[]> {
   if (!username) {
    console.error('GitHub username cannot be empty for fetching events.');
    return [];
  }
  try {
    const response = await fetch(`${GITHUB_API_BASE_URL}/users/${username}/events/public?per_page=${perPage}`, {
      headers: commonHeaders,
      next: { revalidate: 600 } // Cache for 10 minutes, as events are more frequent
    });
    if (!response.ok) {
      console.error(`Failed to fetch events for ${username}: ${response.status} ${response.statusText}`);
      return [];
    }
    const data: GitHubEvent[] = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching events for ${username}:`, error);
    return [];
  }
}
