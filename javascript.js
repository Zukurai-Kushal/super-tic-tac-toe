function createBoard(){
    const board = [];
    let boardState = "in-play";
    let movesRemaining = 9;

    const initialize = ()=>{
        for (let i=0; i<3; i++){
            board[i] = [' ', ' ', ' '];
        }
        boardState = "in-play";
        movesRemaining = 9;
    };

    const printToConsole = ()=>{
        for (let i=0; i<3; i++){
            console.log(board[i]);
        }
    };

    const makeMove = (symbol, row, col)=>{
        if(board[row][col] !== ' ' || boardState !== "in-play"){
            console.log("Invalid Move!");
            return false;
        }
        board[row][col] = symbol;
        movesRemaining--;
        console.log(checkMove(symbol, row, col));
        printToConsole();
        return true;
    };

    const checkMove = (symbol, row, col)=>{

        // Check row
        for(let i=0; i<=3; i++){
            if(i == 3){
                boardState = `${symbol}-win`;
                return (["row-win", row]);
            }
            else if(board[row][i] === symbol){
                continue;
            }
            else{
                break;
            }
        }

        // Check col
        for(let i=0; i<=3; i++){
            if(i == 3){
                boardState = `${symbol}-win`;
                return (["col-win", col]);
            }
            else if(board[i][col] === symbol){
                continue;
            }
            else{
                break;
            }
        }

        // Check diagonals
        for(let i=0; i<=3; i++){
            if(i == 3){
                boardState = `${symbol}-win`;
                return (["diagonal-win", 1]);
            }
            else if(board[i][i] === symbol){
                continue;
            }
            else{
                break;
            }
        }

        for(let i=0; i<=3; i++){
            if(i == 3){
                boardState = `${symbol}-win`;
                return (["diagonal-win", 2]);
            }
            else if(board[2-i][i] === symbol){
                continue;
            }
            else{
                break;
            }
        }

        // Check for draws
        if(movesRemaining <= 0){
            boardState = "draw";
            return ("draw");
        }
        return false;
    };

    const getBoardState = ()=>{
        return boardState;
    }

    initialize();
    return{initialize, makeMove, getBoardState};
}

const BigBoard = (function(){
    const boards = [];
    let bigBoardState = "in-play";
    let movesRemaining = 9;
    let lastMove = undefined;

    const initialize = ()=>{
        for(let i=0; i<3; i++){
            boards[i] = [createBoard(), createBoard(), createBoard()];
        }
        bigBoardState = "in-play";
        movesRemaining = 9;
        lastMove = undefined;
    }

    const printToConsole = ()=>{
        for (let i=0; i<3; i++){
            console.log([boards[i][0].getBoardState(), boards[i][1].getBoardState(), boards[i][2].getBoardState()]);
        }
        console.log(`Last move: (${lastMove[0]},${lastMove[1]})`);
    }

    const makeMove = (symbol, bigRow, bigCol, row, col)=>{

        if(bigBoardState !== "in-play"){
            console.log("Invalid move! Restart game");
            return false;
        }

        if(lastMove !== undefined && boards[lastMove[0]][lastMove[1]].getBoardState() === "in-play"){
            if( (bigRow !== lastMove[0] || bigCol !== lastMove[1])){
                console.log(`Invalid move! Pick correct board! (${lastMove[0]},${lastMove[1]})`);
                return false;
            }
        }

        if(boards[bigRow][bigCol].makeMove(symbol, row, col) == true){
            lastMove = [row, col];
            printToConsole();
            if(boards[bigRow][bigCol].getBoardState() != "in-play"){
                movesRemaining--;
                console.log(`Moves remaining: ${movesRemaining}`);
                console.log(checkMove(boards[bigRow][bigCol].getBoardState(), bigRow, bigCol));
            }
            return true;
        }
        else{
            return false;
        }
    }

    const checkMove = (boardState, bigRow, bigCol)=>{
        // Check row
        for(let i=0; i<=3; i++){
            if(i == 3){
                console.log("Big Board Win!");
                bigBoardState = boardState;
                return (["row-win", bigRow]);
            }
            else if(boards[bigRow][i].getBoardState() === boardState){
                continue;
            }
            else{
                break;
            }
        }

        // Check col
        for(let i=0; i<=3; i++){
            if(i == 3){
                console.log("Big Board Win!");
                bigBoardState = boardState;
                return (["col-win", bigCol]);
            }
            else if(boards[i][bigCol].getBoardState() === boardState){
                continue;
            }
            else{
                break;
            }
        }

        // Check diagonals
        for(let i=0; i<=3; i++){
            if(i == 3){
                console.log("Big Board Win!");
                bigBoardState = boardState;
                return (["diagonal-win", 1]);
            }
            else if(boards[i][i].getBoardState() === boardState){
                continue;
            }
            else{
                break;
            }
        }

        for(let i=0; i<=3; i++){
            if(i == 3){
                console.log("Big Board Win!");
                bigBoardState = boardState;
                return (["diagonal-win", 2]);
            }
            else if(boards[2-i][i].getBoardState() === boardState){
                continue;
            }
            else{
                break;
            }
        }

        // Check for draws
        if(movesRemaining <= 0){
            console.log("Big Board Draw!");
            bigBoardState = "draw";
            return ("draw");
        }
        return false;
    }

    const getBoardState = ()=>{
        return bigBoardState;
    }

    initialize();
    return{initialize, printToConsole, makeMove, getBoardState};
})();

const Game = (function(){
    
    let currPlayer = 'x';
    let xScore = 0;
    let oScore = 0;

    const reset = ()=>{
        currPlayer = 'x';
        BigBoard.initialize();
    }

    const makeMove = (bigCol, bigRow, row, col)=>{
        if(BigBoard.makeMove(currPlayer, bigCol, bigRow, row, col) == true){
            if(BigBoard.getBoardState() == "x-win"){
                xScore++;
            }
            else if(BigBoard.getBoardState() == "o-win"){
                oScore++;
            }
            currPlayer = (currPlayer == 'x')? 'o' : 'x';
        }
    }

    return{makeMove, reset};

})();
