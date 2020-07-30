document.addEventListener('DOMContentLoaded', () =>{
    const grid = document.querySelector('.grid')
    let width = 10
    let bombNumber = 20
    let squares = []
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
        }

    // adding surrounding numbers
    for (let i = 0; i < squares.length; i++){
        let total_numbers = 0
        const isLeftEdge = (i % width === 0)
        const isRightEdge = (i % width === width - 1)

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


            squares[i].setAttribute('data', total_numbers)

        }
    }

    }
    createBoard()

    //click on square actions
    function click(square){
        if (isGameOver){
            return
        }
        if (square.classList.contains('checked') || square.classList.contains('flag')){
            return
        }

        // if the class contains a bomb then game over
        if (square.classList.contains('bomb')){
            alert('Game over')
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
            square.classList.add('checked')
        }
    }

})