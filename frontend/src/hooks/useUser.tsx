export default function useUser() {
  const user =
    (JSON.parse(localStorage.getItem("user") as string) as {
      token: string;
      user: User;
    }) || null;
  return { user, isAuthenticated: !!user };
}
