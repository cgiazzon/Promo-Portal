@echo off
echo =======================================================
echo          RESTAURANDO BIBLIOTECAS (1a Vez)
echo Isso pode levar alguns minutinhos... aguarde.
echo =======================================================
:: Alteração Crítica de Estabilidade (Anti-Travamento do NPX)
call npm install -g pnpm
call pnpm install

echo.
echo =======================================================
echo          INICIANDO SERVIDOR DO SITE
echo =======================================================
call pnpm --filter @workspace/keropromo dev
pause
