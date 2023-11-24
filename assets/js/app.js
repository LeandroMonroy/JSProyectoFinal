const homeCardItems = document.getElementById('homeCardItems')
const homeTableItems = document.getElementById('homeTableItems')
const homeTableFooter = document.getElementById('homeTableFooter')
const nCart = document.getElementById('nCart')

const templateHomeCard = document.getElementById('templateHomeCard').content
const templateTableFooter = document.getElementById('templateTableFooter').content
const templateCart = document.getElementById('templateCart').content
const fragment = document.createDocumentFragment()
let carrito = {}

document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    //Pasar el carrito al LocalStorage
    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        cargarCarrito()
    }
})

homeCardItems.addEventListener('click', e => {
    agregarCarrito(e)
})

homeTableItems.addEventListener('click', e => {
    btnEdit(e)
})

/* Capturar Datos desde JSON Local */
const fetchData = async() => {
    try {
        const res = await fetch('./assets/json/data.json')
        const data = await res.json()
        cargarHomeCard(data) //Cargar Cards al Home
    } catch (error) {
        console.log(error)
    }
}

/* Cargar Cards al Home */
const cargarHomeCard = data => {
    data.forEach(producto => {
        templateHomeCard.querySelector('.card-title').textContent = producto.title
        templateHomeCard.querySelector('.card-subtitle').textContent = producto.subtitle
        templateHomeCard.querySelector('.card-description').textContent = producto.description
        templateHomeCard.querySelector('img').setAttribute('src', producto.img)
        templateHomeCard.querySelector('.buy-btn').dataset.id = producto.id
        templateHomeCard.querySelector('.card-price').textContent = producto.price

        templateHomeCard.querySelector('.card').classList.add(producto.ccolor)
        /*
        No pude corregir este problema, la idea que sólo me agregue la clase a algunos divs
        cuando corresponda, pero los termina agregando a todos
        if(producto.ccolor != ""){
            templateHomeCard.querySelector('.card').classList.add(producto.ccolor)
            console.log('c-black')
        }
        */
        //console.log(templateHomeCard.querySelector('.card').classList)

        const clone = templateHomeCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    homeCardItems.appendChild(fragment)
}

/* Agregar al Carrito */
const agregarCarrito = e => {
    if(e.target.classList.contains('buy-btn')){
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector('.buy-btn').dataset.id,
        title: objeto.querySelector('.card-title').textContent,
        price: objeto.querySelector('.card-price').textContent,
        quantity: 1
    }
    if(carrito.hasOwnProperty(producto.id)){
        producto.quantity = carrito[producto.id].quantity+1
    }
    carrito[producto.id] = {...producto}
    cargarCarrito()
}

const cargarCarrito = () =>{
    homeTableItems.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateCart.querySelector('th').textContent = producto.id
        templateCart.querySelector('.title').textContent = producto.title
        templateCart.querySelector('.price').textContent = producto.price
        templateCart.querySelector('.quantity').textContent = producto.quantity
        templateCart.querySelector('.btn-less').dataset.id = producto.id
        templateCart.querySelector('.btn-plus').dataset.id = producto.id
        templateCart.querySelector('.subtotal').textContent = producto.quantity * producto.price
    
       
        const clone = templateCart.cloneNode(true)
        fragment.appendChild(clone)
    })
    homeTableItems.appendChild(fragment)
    cargarTableFooter()

    //Guardamos en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const cargarTableFooter = () =>{
    homeTableFooter.innerHTML = ''
    if(Object.keys(carrito).length === 0){
        homeTableFooter.innerHTML = `
        <th scope="row" colspan="6">Empty, buy your new gadget.</th>`
    return 
    }

    const xCantidad = Object.values(carrito).reduce((acc, {quantity}) => acc + quantity, 0 )
    const xTotal = Object.values(carrito).reduce((acc, {quantity, price}) => acc + quantity * price, 0 )
    
    templateTableFooter.querySelectorAll('td')[0].textContent = xCantidad
    templateTableFooter.querySelector('span').textContent = xTotal

    nCart.textContent = xCantidad
    
   

    const clone = templateTableFooter.cloneNode(true)
    fragment.appendChild(clone)
    homeTableFooter.appendChild(fragment)

    const btnDropAll = document.getElementById('btn-dropAll')
    btnDropAll.addEventListener('click', () => {
        carrito = {}
        cargarCarrito()
    })
}

const btnEdit = e => {
    if(e.target.classList.contains('btn-plus')){
        const producto = carrito[e.target.dataset.id]
        producto.quantity++
        cargarCarrito()
    }

    if(e.target.classList.contains('btn-less')){
        const producto = carrito[e.target.dataset.id]
        producto.quantity --
        if(producto.quantity === 0){
            delete carrito[e.target.dataset.id]
        }
        cargarCarrito()
    }
    e.stopPropagation()
}









