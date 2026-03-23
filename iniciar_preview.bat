@echo off
echo =======================================================
echo          RESTAURANDO BIBLIOTECAS (1a Vez)
echo Isso pode levar alguns minutinhos... aguarde.
echo =======================================================
npx pnpm install

echo.
echo =======================================================
echo          INICIANDO SERVIDOR DO SITE
echo =======================================================
npx pnpm --filter @workspace/keropromo dev
pause
