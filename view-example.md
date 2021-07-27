# View Example
```html
<!DOCTYPE html>
<html lang="es">
<head>
    <title>Title | <%= title %></title>
    <%- include('partials/header'); -%>
</head>
<body>
    <%- include('partials/navbar'); -%>
    
    <main class="main-container text-center">
        <h1><%= title %> <strong>Section</strong></h1>
        <div class="main-content">

        </div>
    </main>
</body>
</html>
```