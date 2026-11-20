import { Lightbulb, LogOut, Moon } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../../../shared/state/themeSlice";
import { removeEmployee } from "../../../auth/state/auth/authSlice";
import { axiosInstance } from "../../../../config/axiosInstance";
import { useNavigate } from "react-router";

const TopNav = () => {
  let dispatch = useDispatch();
  const navigate = useNavigate();

  let { mode } = useSelector((store) => store.theme);
  let { employee } = useSelector((store) => store.auth);

  let handleThemeChange = () => {
    dispatch(toggleTheme());
  };

  const handleLogout = async () => {
    try { await axiosInstance.post("/auth/logout"); }
    finally { dispatch(removeEmployee()); navigate("/"); }
  };

  return (
    <div className="flex items-center justify-between rounded-xl bg-[var(--bg-card)] px-4 py-3 text-[var(--text-primary)]">
      <div><p className="font-medium">Team Sync</p><p className="text-xs text-[var(--text-muted)]">{employee?.email}</p></div>
      <div className="flex items-center gap-4">
        {mode === "light" ? (
          <button type="button" onClick={handleThemeChange} aria-label="Switch to dark theme" title="Switch to dark theme"><Moon size={20} /></button>
        ) : (
          <button type="button" onClick={handleThemeChange} aria-label="Switch to light theme" title="Switch to light theme"><Lightbulb size={20} /></button>
        )}

        <button type="button" onClick={handleLogout} className="flex items-center gap-2 text-sm" aria-label="Sign out"><LogOut size={19} /><span className="hidden sm:inline">Sign out</span></button>
      </div>
    </div>
  );
};

export default TopNav;
