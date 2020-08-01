document.addEventListener('DOMContentLoaded', function() {
    // inti the settings model
    var elems = document.querySelectorAll('.modal');

    // used to init the settings model 
    var instances = M.Modal.init(elems);

    // loading a new game with the page load
    newGame()

    //setting the number of bombs in the status bar
    let leftBombsDivv = document.getElementById('bombsLeftDiv')
    
    leftBombsDivv.innerHTML =  leftBombsDivv.innerHTML + " " + parseInt( bombNumber) + " "
});


// number of bombs
let bombNumber = 20
let width = 10              //width of the cell

function newGame(){
    
         // selecting the grid
        const grid = document.querySelector('.grid')
        
        bombNumber = parseInt(document.getElementById('nbrBombs').value)
        let flags = 0
        let squares = []            //list that contains all the cells in the gid
        let isGameOver = false


        // create board
        function createBoard(){
            const bombArray = Array(bombNumber).fill('bomb')
            const emptyArray = Array(width * width - bombNumber).fill('valid')
            const gameArray = emptyArray.concat(bombArray)
            const shuffledArray = gameArray.sort(() => Math.random() -0.5)

            // creating the squares
            for(let i = 0; i < width * width; i++){
                const square = document.createElement('div')
                square.setAttribute('id', i)
                square.classList.add(shuffledArray[i])
                grid.appendChild(square)
                squares.push(square)

            // normal click
            square.addEventListener('click', function(e){
                click(square)
            })

            // right click to add flag event listener
            square.oncontextmenu = function(e){
                e.preventDefault()
                addFlag(square)

                // displaying the left bombs on the status bar 
                let leftBombsDivv = document.getElementById('bombsLeftDiv')

            }
            }

            
        // adding surrounding numbers
        for (let i = 0; i < squares.length; i++){
            let total_numbers = 0
            // boolean values if the current cell is a left or right edge cell
            const isLeftEdge = (i % width === 0)
            const isRightEdge = (i % width === width - 1)

            // if the cell is not a bomb then we check its surroundings and add to the total nbr of bombs
            if (squares[i].classList.contains('valid')){
                if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')){
                    total_numbers ++
                }
                if (i > 9 && !isRightEdge && squares[i + 1 -width].classList.contains('bomb')){
                    total_numbers ++
                }
                if (i > 10 && squares[i - width].classList.contains('bomb')){
                    total_numbers ++
                }
                if (i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')){
                    total_numbers ++
                }
                if (i < 98 && !isRightEdge && squares[i + 1].classList.contains('bomb')){
                    total_numbers ++
                } 
                if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')){
                    total_numbers ++
                }
                if (i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) {
                    total_numbers ++
                }
                if (i < 89 && squares[i + width].classList.contains('bomb')){
                    total_numbers ++
                }

                // the data attribute is used to display the total number of surrounding bombs of a specific cell
                squares[i].setAttribute('data', total_numbers)

            }
        }

        }
        createBoard()

        function addFlag(square){
            if (isGameOver){
                return
            }
            if (!square.classList.contains('checked') && (flags < bombNumber)){
                if(!square.classList.contains('flag')){
                    square.classList.add('flag')
                    square.innerHTML = '🚩'
                    winCheck()
                }else{
                    square.classList.remove('flag')
                    square.innerHTML = ''
                    flags --
                }
            }
        }

        //click on square actions
        function click(square){
            let currentId = square.id
            
            if (isGameOver){
                
                return
            }
            if (square.classList.contains('checked') || square.classList.contains('flag')){
                return
            }

            // if the class contains a bomb then game over
            if (square.classList.contains('bomb')){
                let gameOverTxt = document.getElementById('gameOverText')
                gameOverTxt.classList.remove('hide')
                gameOver(square)
            }else{
                
                let total = square.getAttribute('data')
                if (total != 0){
                    // checking the cell if it's not checked, and if it is empty we give it the 
                    // checked class too without showing the number
                    square.classList.add('checked')
                    // showing the number on the cell
                    square.innerHTML = total
                    return
                }
                checkSquare(square, currentId)
                square.classList.add('checked')
            }
            
        }

        // check neibouring squares once a square is clicked
        function checkSquare(square, currentId){
            const isLeftEge = (currentId % width === 0)
            const isRightEdge = (currentId % width === width - 1)

            setTimeout(() => {
                if (currentId > 0 && !isLeftEge){
                    const newId = squares[parseInt(currentId) - 1].id
                    const newSquare = document.getElementById(newId)
                    click(newSquare)
                }
                if (currentId > 9 && !isRightEdge){
                    const newId = squares[parseInt(currentId) + 1 -width].id
                    const newSquare = document.getElementById(newId)
                    click(newSquare)
                }
                if (currentId > 10){
                    const newId = squares[parseInt(currentId - width)].id
                    const newSquare = document.getElementById(newId)
                    click(newSquare)
                }
                if (currentId > 11 && !isLeftEge){
                    const newId = squares[parseInt(currentId - 1 - width)].id
                    const newSquare = document.getElementById(newId)
                    click(newSquare)
                }
                if (currentId < 98 && !isRightEdge){
                    const newId = squares[parseInt(currentId) + 1].id
                    const newSquare = document.getElementById(newId)
                    click(newSquare)
                }
                if (currentId < 90 && !isLeftEge){
                    const newId = squares[parseInt(currentId) - 1 + width].id
                    const newSquare = document.getElementById(newId)
                    click(newSquare)
                }
                if (currentId < 88 && !isRightEdge){
                    const newId = squares[parseInt(currentId) + 1 + width].id
                    const newSquare = document.getElementById(newId)
                    click(newSquare)
                }
                if (currentId < 89){
                    const newId = squares[parseInt(currentId) + width].id
                    const newSquare = document.getElementById(newId)
                    click(newSquare)
                }

            }, 10)
        }

        function gameOver(square){
            console.log('game over')
            isGameOver = true

            // showing bombs location
            squares.forEach(square =>{
                if (square.classList.contains('bomb')){
                    square.innerHTML = "<img style= src=/resources/bomb.png>"
                }
            })
        }

        function winCheck(){
            let matches = 0
            for (let i = 0; i <squares.length; i++){
                if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')){
                    matches ++
                }
                
                if (matches === bombNumber){
                    console.log('YOU WON')
                    isGameOver = true
                }
                
            }
        }
        }

function saveBtn(){
    bombNumber = document.getElementById('nbrBombs').value
    console.log(bombNumber)
    removeBoard()
    newGame()

    //closing the model after saving 
    var elem = document.querySelectorAll('.modal');
    var instance = M.Modal.init(elem);

     //setting the number of bombs in the status bar
     let leftBombsDivv = document.getElementById('bombsLeftDiv')
     leftBombsDivv.innerHTML =  leftBombsDivv.innerHTML + " " + parseInt( bombNumber) + " "

     // hiding the game over text if it is shown
     let gameOverTxt = document.getElementById('gameOverText')
    gameOverTxt.classList.add('hide')
}

function removeBoard(){
    const grid = document.querySelector('.grid')
    for(let i = 0; i < width * width; i++){
        document.getElementById(i).outerHTML = "";
    }
}

function resetBtn(){
    // removing the game over text if it is shown
    let gameOverTxt = document.getElementById('gameOverText')
    gameOverTxt.classList.add('hide')
    removeBoard()
    newGame()
}
// document.addEventListener('DOMContentLoaded', () =>{
//     // selecting the grid
//     const grid = document.querySelector('.grid')
//     let width = 10              //width of the cell
//     let bombNumber = 15
//     let flags = 0
//     let squares = []            //list that contains all the cells in the gid
//     let isGameOver = false


//     // create board
//     function createBoard(){
//         const bombArray = Array(bombNumber).fill('bomb')
//         const emptyArray = Array(width * width - bombNumber).fill('valid')
//         const gameArray = emptyArray.concat(bombArray)
//         const shuffledArray = gameArray.sort(() => Math.random() -0.5)

//         // creating the squares
//         for(let i = 0; i < width * width; i++){
//             const square = document.createElement('div')
//             square.setAttribute('id', i)
//             square.classList.add(shuffledArray[i])
//             grid.appendChild(square)
//             squares.push(square)

//         // normal click
//         square.addEventListener('click', function(e){
//             click(square)
//         })

//         // right click to add flag event listener
//         square.oncontextmenu = function(e){
//             e.preventDefault()
//             addFlag(square)
//         }
        
//         }

        

//     // adding surrounding numbers
//     for (let i = 0; i < squares.length; i++){
//         let total_numbers = 0
//         // boolean values if the current cell is a left or right edge cell
//         const isLeftEdge = (i % width === 0)
//         const isRightEdge = (i % width === width - 1)

//         // if the cell is not a bomb then we check its surroundings and add to the total nbr of bombs
//         if (squares[i].classList.contains('valid')){
//             if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')){
//                 total_numbers ++
//             }
//             if (i > 9 && !isRightEdge && squares[i + 1 -width].classList.contains('bomb')){
//                 total_numbers ++
//             }
//             if (i > 10 && squares[i - width].classList.contains('bomb')){
//                 total_numbers ++
//             }
//             if (i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')){
//                 total_numbers ++
//             }
//             if (i < 98 && !isRightEdge && squares[i + 1].classList.contains('bomb')){
//                 total_numbers ++
//             } 
//             if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')){
//                 total_numbers ++
//             }
//             if (i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) {
//                 total_numbers ++
//             }
//             if (i < 89 && squares[i + width].classList.contains('bomb')){
//                 total_numbers ++
//             }

//             // the data attribute is used to display the total number of surrounding bombs of a specific cell
//             squares[i].setAttribute('data', total_numbers)

//         }
//     }

//     }
//     createBoard()

//     function addFlag(square){
//         if (isGameOver){
//             return
//         }
//         if (!square.classList.contains('checked') && (flags < bombNumber)){
//             if(!square.classList.contains('flag')){
//                 square.classList.add('flag')
//                 square.innerHTML = '🚩'
//                 winCheck()
//             }else{
//                 square.classList.remove('flag')
//                 square.innerHTML = ''
//                 flags --
//             }
//         }
//     }

//     //click on square actions
//     function click(square){
//         let currentId = square.id
        
//         if (isGameOver){
//             return
//         }
//         if (square.classList.contains('checked') || square.classList.contains('flag')){
//             return
//         }

//         // if the class contains a bomb then game over
//         if (square.classList.contains('bomb')){
//             gameOver(square)
//         }else{
            
//             let total = square.getAttribute('data')
//             if (total != 0){
//                 // checking the cell if it's not checked, and if it is empty we give it the 
//                 // checked class too without showing the number
//                 square.classList.add('checked')
//                 // showing the number on the cell
//                 square.innerHTML = total
//                 return
//             }
//             checkSquare(square, currentId)
//             square.classList.add('checked')
//         }
        
//     }

//     // check neibouring squares once a square is clicked
//     function checkSquare(square, currentId){
//         const isLeftEge = (currentId % width === 0)
//         const isRightEdge = (currentId % width === width - 1)

//         setTimeout(() => {
//             if (currentId > 0 && !isLeftEge){
//                 const newId = squares[parseInt(currentId) - 1].id
//                 const newSquare = document.getElementById(newId)
//                 click(newSquare)
//             }
//             if (currentId > 9 && !isRightEdge){
//                 const newId = squares[parseInt(currentId) + 1 -width].id
//                 const newSquare = document.getElementById(newId)
//                 click(newSquare)
//             }
//             if (currentId > 10){
//                 const newId = squares[parseInt(currentId - width)].id
//                 const newSquare = document.getElementById(newId)
//                 click(newSquare)
//             }
//             if (currentId > 11 && !isLeftEge){
//                 const newId = squares[parseInt(currentId - 1 - width)].id
//                 const newSquare = document.getElementById(newId)
//                 click(newSquare)
//             }
//             if (currentId < 98 && !isRightEdge){
//                 const newId = squares[parseInt(currentId) + 1].id
//                 const newSquare = document.getElementById(newId)
//                 click(newSquare)
//             }
//             if (currentId < 90 && !isLeftEge){
//                 const newId = squares[parseInt(currentId) - 1 + width].id
//                 const newSquare = document.getElementById(newId)
//                 click(newSquare)
//             }
//             if (currentId < 88 && !isRightEdge){
//                 const newId = squares[parseInt(currentId) + 1 + width].id
//                 const newSquare = document.getElementById(newId)
//                 click(newSquare)
//             }
//             if (currentId < 89){
//                 const newId = squares[parseInt(currentId) + width].id
//                 const newSquare = document.getElementById(newId)
//                 click(newSquare)
//             }

//         }, 10)
//     }

//     function gameOver(square){
//         console.log('game over')
//         isGameOver = true

//         // showing bombs location
//         squares.forEach(square =>{
//             if (square.classList.contains('bomb')){
//                 square.innerHTML = '💣'
//             }
//         })
//     }

//     function winCheck(){
//         let matches = 0
//         for (let i = 0; i <squares.length; i++){
//             if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')){
//                 matches ++
//             }
            
//             if (matches === bombNumber){
//                 console.log('YOU WON')
//                 isGameOver = true
//             }
            
//         }
//     }

// })