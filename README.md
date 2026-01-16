# [https://i-climbed.vercel.app/](https://i-climbed.vercel.app/)
поиск трасс с Allclimb, загрузка и редактирование изображения трассы

<br><br>
скалолазательные регионы, места, сектора и трассы загрженны с Allclimb в postgress DB.<br />
по запросу со страницы трассы - playwright забегает на Allclimb и делает скриншот соответствующего изображения скалы с canvas линиями трасс.<br />
на открытку пролаза трассы можно добавить свой текст и скачать<br />
<br><br>

## Микрофронтенд
реализация микрофронтенда, с использованием module federation. 
микрофронтенд https://github.com/sKondoR/edit-route-image задеплоен на vercel https://edit-route-image-mf.vercel.app/
пока не работает с nextjs app routing, пришлось перейти на pages routing, понизить nextjs до 15 версии и подключить webpack вместо turbopack
app routing на будущее лежит в ветке https://github.com/sKondoR/i-climbed/tree/app-routing


<br><br>
## Стэк
NextJS, React, Tanstack React Query, Drizzle ORM, TailwindCSS, Playwright
