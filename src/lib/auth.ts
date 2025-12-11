import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  nickname: string;
  created_at: string;
  updated_at: string;
}

export interface Progress {
  id: string;
  user_id: string;
  chapter_id: string;
  gate_id: string;
  completed: boolean;
  completed_at?: string;
}

// Sign up a new user
export async function signUp(email: string, password: string, nickname: string): Promise<{ user: User | null; error: Error | null }> {
  const redirectUrl = `${window.location.origin}/`;
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
      data: {
        nickname,
      },
    },
  });

  if (error) {
    return { user: null, error };
  }

  return { user: data.user, error: null };
}

// Sign in an existing user
export async function signIn(email: string, password: string): Promise<{ user: User | null; error: Error | null }> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { user: null, error };
  }

  return { user: data.user, error: null };
}

// Sign out
export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

// Get current session
export async function getSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

// Get user profile
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data;
}

// Update user profile
export async function updateProfile(userId: string, nickname: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .update({ nickname })
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating profile:", error);
    return null;
  }

  return data;
}

// Save progress
export async function saveProgress(
  userId: string,
  chapterId: string,
  gateId: string,
  completed: boolean
): Promise<void> {
  const { error } = await supabase
    .from("progress")
    .upsert(
      {
        user_id: userId,
        chapter_id: chapterId,
        gate_id: gateId,
        completed,
        completed_at: completed ? new Date().toISOString() : null,
      },
      {
        onConflict: "user_id,chapter_id,gate_id",
      }
    );

  if (error) {
    console.error("Error saving progress:", error);
    throw error;
  }
}

// Get progress for a chapter
export async function getProgress(userId: string, chapterId: string): Promise<Progress[]> {
  const { data, error } = await supabase
    .from("progress")
    .select("*")
    .eq("user_id", userId)
    .eq("chapter_id", chapterId);

  if (error) {
    console.error("Error fetching progress:", error);
    return [];
  }

  return data || [];
}

// Define all chapters and gates
const ALL_GATES = [
  { chapterId: "chapter1", gates: ["gate1", "gate2", "gate3", "gate4", "gate5"] },
  { chapterId: "chapter2", gates: ["gate1", "gate2", "gate3", "gate4", "gate5"] },
  { chapterId: "chapter3", gates: ["gate1", "gate2", "gate3", "gate4", "gate5"] },
  { chapterId: "chapter4", gates: ["gate1", "gate2", "gate3", "gate4", "gate5"] },
  { chapterId: "chapter5", gates: ["gate1", "gate2", "gate3", "gate4"] },
  { chapterId: "chapter6", gates: ["gate1", "gate2", "gate3", "gate4"] },
];

// Unlock all gates for a user (master key feature)
export async function unlockAllGates(userId: string): Promise<void> {
  const progressEntries = ALL_GATES.flatMap((chapter) =>
    chapter.gates.map((gateId) => ({
      user_id: userId,
      chapter_id: chapter.chapterId,
      gate_id: gateId,
      completed: true,
      completed_at: new Date().toISOString(),
    }))
  );

  const { error } = await supabase.from("progress").upsert(progressEntries, {
    onConflict: "user_id,chapter_id,gate_id",
  });

  if (error) {
    console.error("Error unlocking all gates:", error);
    throw error;
  }
}
