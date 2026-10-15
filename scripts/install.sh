#!/usr/bin/env bash
# Everything Antigravity Installer for macOS & Linux
# Authored by Sanish Gyawali

set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE_SKILLS="$REPO_ROOT/skills"
SOURCE_RULES="$REPO_ROOT/rules"
SOURCE_GEMINI="$REPO_ROOT/templates/GEMINI.md"

echo ""
echo -e "\033[1;36m============================================================\033[0m"
echo -e "\033[1;33m             🚀 EVERYTHING ANTIGRAVITY INSTALLER             \033[0m"
echo -e "\033[1;32m           High-Performance Agent Engineering Suite         \033[0m"
echo -e "\033[0;37m                   Authored by Sanish Gyawali               \033[0m"
echo -e "\033[1;36m============================================================\033[0m"
echo ""

install_global() {
    GLOBAL_DIR="$HOME/.gemini/config/skills"
    echo -e "📦 Installing skills globally to: \033[1;36m$GLOBAL_DIR\033[0m"
    mkdir -p "$GLOBAL_DIR"
    cp -r "$SOURCE_SKILLS"/* "$GLOBAL_DIR/"
    echo -e "\033[1;32m✅ Successfully installed skills globally into Antigravity!\033[0m"
}

install_workspace() {
    TARGET_DIR="${1:-$(pwd)}"
    echo -e "📁 Setting up workspace at: \033[1;36m$TARGET_DIR\033[0m"
    mkdir -p "$TARGET_DIR/.agents/skills"
    mkdir -p "$TARGET_DIR/.agents/rules"
    
    cp -r "$SOURCE_SKILLS"/* "$TARGET_DIR/.agents/skills/"
    cp -r "$SOURCE_RULES"/* "$TARGET_DIR/.agents/rules/"
    
    if [ ! -f "$TARGET_DIR/GEMINI.md" ]; then
        cp "$SOURCE_GEMINI" "$TARGET_DIR/GEMINI.md"
        echo -e "   Created root GEMINI.md"
    else
        echo -e "\033[1;33m   ⚠️ GEMINI.md already exists in workspace root (skipping overwrite).\033[0m"
    fi
    echo -e "\033[1;32m✅ Successfully configured workspace for Everything Antigravity!\033[0m"
}

case "$1" in
    --global|-g)
        install_global
        ;;
    --workspace|-w)
        install_workspace "$2"
        ;;
    *)
        echo "Choose installation target:"
        echo "  [1] Global    - Install 300+ skills into ~/.gemini/config/skills/ (Available across all sessions)"
        echo "  [2] Workspace - Install into current project (.agents/skills, .agents/rules, GEMINI.md)"
        echo "  [3] Both      - Install Globally and into current directory"
        echo "  [Q] Quit"
        echo ""
        read -p "Select option [1-3, Q]: " choice
        case "$choice" in
            1) install_global ;;
            2) install_workspace "$(pwd)" ;;
            3) install_global; install_workspace "$(pwd)" ;;
            *) echo "Installation cancelled." ;;
        esac
        ;;
esac

echo ""
echo -e "\033[1;33m🎉 Installation complete! Start or restart Antigravity to use your new capabilities.\033[0m"
echo ""
