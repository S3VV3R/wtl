# Публикация на GitHub Pages

Готовая сборка `dist/` включается в Git. Workflow публикует её без установки npm-зависимостей. Исходники остаются в `src/`.

1. Создайте пустой репозиторий на GitHub, без README и .gitignore.
2. Откройте терминал в этой папке и выполните:

```powershell
git init -b main
git add .
git commit -m "Prepare site for GitHub Pages"
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

Замените USERNAME и REPOSITORY своими значениями.

3. В Settings → Pages → Source выберите **GitHub Actions**.
4. Дождитесь workflow Deploy to GitHub Pages. Если первая попытка была до включения Pages, запустите её повторно через Actions → Run workflow.

После правок исходников выполните `npm install` и `npm run build`, затем закоммитьте и исходники, и обновлённый `dist/`. Требуется Node.js 22.12+.

Адрес сайта будет https://USERNAME.github.io/REPOSITORY/ . Никакого push за вас не выполнялось.
