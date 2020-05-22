const apiUrl = 'https://jsonplaceholder.typicode.com';

// función para hacer el fetch
const doFetch = async (url) => {
  const response = await fetch(url);
  const formattedResponse = await response.json();
  return formattedResponse;
};

// las etiquetas del HTML
let navDiv = document.createElement('div');
navDiv.classList.add('navegacion');
document.body.appendChild(navDiv);
let postsDiv = document.createElement('div');
postsDiv.classList.add('publicacion');
document.body.appendChild(postsDiv);
let commentsDiv = document.createElement('div');
commentsDiv.id = 'comentarios';
document.body.appendChild(commentsDiv);
let commentBody;

// Buscar y traer los usuarios

const usersFetch = async () => {
  const usersFetched = await doFetch(`${apiUrl}/users`);
  console.log(usersFetched);
  for (usuario of usersFetched) {
    let nav = document.createElement('h2');
    nav.innerHTML = `<a href="#" id=${usuario.id}>${usuario.name}</a>`;
    navDiv.appendChild(nav);
  }
};
usersFetch();

// Añadir evento para luego buscar posts de usuario en particular
navDiv.addEventListener('click', (e) => {
  if (!e.target.id) {
    return;
  } else {
    postsDiv.innerHTML = 'LOADING...';
    let id = e.target.id;

    //buscar los posts y mostrar en pantalla
    const fetchPosts = async () => {
      const postsFetched = await doFetch(`${apiUrl}/users/${id}/posts`);
      try {
        postsDiv.innerHTML = '';
        for (post of postsFetched) {
          let postTitle = document.createElement('h2');
          let postBody = document.createElement('p');
          let postDiv = document.createElement('div');
          postDiv.classList.add('posts');
          postTitle.innerHTML = `<a href="#comentarios" id=${post.id}>${post.title}</a>`;
          postBody.innerHTML = post.body;
          postDiv.appendChild(postTitle);
          postDiv.appendChild(postBody);
          postsDiv.appendChild(postDiv);
        }
      } catch (error) {
        postsDiv.innerHTML = error + 'Vuelva a cargar la página';
      }
    };
    fetchPosts();
  }
});

//agregar un listener a los post para buscar sus comentarios
postsDiv.addEventListener('click', (e) => {
  if (!e.target.id) {
    return;
  } else {
    commentsDiv.innerHTML = 'LOADING...';
    let comementsid = e.target.id;
    console.log(comementsid);

    // hacer fetch de los comentarios del post clickeado
    const commentsFetch = async () => {
      const commentsFetched = await doFetch(
        `${apiUrl}/posts/${comementsid}/comments`
      );
      try {
        //mostrar los comentarios en pantalla
        console.log(commentsFetched);
        let postId = commentsFetched[0].postId;
        console.log(postId);
        commentsDiv.innerHTML = '';
        for (comentario of commentsFetched) {
          let commentName = document.createElement('h4');
          commentBody = document.createElement('p');
          commentName.innerHTML = comentario.name;
          commentBody.innerHTML = comentario.body;
          let eachComment = document.createElement('div');
          eachComment.appendChild(commentName);
          eachComment.appendChild(commentBody);
          commentsDiv.appendChild(eachComment);
        }

        // creando el form para poder dejar un comentario
        let formDiv = document.createElement('div');
        let form = document.createElement('form');
        formDiv.appendChild(form);
        document.body.appendChild(formDiv);
        let leaveComment = document.createElement('textarea');
        form.appendChild(leaveComment);
        let btn = document.createElement('button');
        form.appendChild(btn);
        btn.innerHTML = 'Añadir comentario';
        let commentValue;

        // handle evento onchange del textarea
        leaveComment.onkeyup = (e) => {
          commentValue = e.target.value;
          console.log(commentValue);
        };

        // handle evento del boton on submit

        btn.onclick = (e) => {
          e.preventDefault();
          commentBody.innerHTML = 'Enviando comentario...';

          //subir el comentario con método POST

          const uploadComment = async () => {
            const postComentario = await fetch(`${apiUrl}/comments`, {
              method: 'POST',
              body: JSON.stringify({
                body: commentValue,
                email: 'nuevocomentario@email.com',
                name: 'il nome di questo',
                postId: postId,
              }),
              headers: {
                'Content-type': 'application/json; charset=UTF-8',
              },
            });

            //Esperar y mostrar el comentario en pantalla

            const nuevo = await postComentario.json();
            console.log(nuevo);
            commentBody.innerHTML = nuevo.body;
          };
          uploadComment();
        };
      } catch (error) {
        console.log(error);
      }
    };
    commentsFetch();
  }
});
