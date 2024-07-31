function createBoard(){
    const board = [];
    let boardState = "in-play";
    let movesRemaining = 9;
    let winInfo = undefined;

    const initialize = ()=>{
        for (let i=0; i<3; i++){
            board[i] = [' ', ' ', ' '];
        }
        boardState = "in-play";
        movesRemaining = 9;
        winInfo = undefined;
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
        checkMove(symbol, row, col);
        printToConsole();
        return true;
    };

    const checkMove = (symbol, row, col)=>{

        // Check row
        for(let i=0; i<=3; i++){
            if(i == 3){
                boardState = `${symbol}-win`;
                winInfo = [boardState, "row-win", row];
                return true;
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
                winInfo = [boardState, "col-win", col];
                return true;
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
                winInfo = [boardState, "diagonal-win", 1];
                return true;
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
                winInfo = [boardState, "diagonal-win", 2];
                return true;
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
            winInfo = [boardState];
            return true;
        }
        return false;
    };

    const getBoardState = ()=>{
        return boardState;
    }

    const getWinInfo = ()=>{
        return winInfo;
    }

    initialize();
    return{initialize, makeMove, getBoardState, getWinInfo};
}

const BigBoard = (function(){
    const boards = [];
    let bigBoardState = "in-play";
    let movesRemaining = 9;
    let winInfo = undefined;
    let lastMove = undefined;
    let smallCellWinInfo = undefined;

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
            smallCellWinInfo = boards[bigRow][bigCol].getWinInfo();
            printToConsole();
            if(boards[bigRow][bigCol].getBoardState() != "in-play"){
                movesRemaining--;
                console.log(`Moves remaining: ${movesRemaining}`);
                checkMove(boards[bigRow][bigCol].getBoardState(), bigRow, bigCol);
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
                winInfo = [bigBoardState, "row-win", bigRow];
                return true;
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
                winInfo = [bigBoardState, "col-win", bigCol];
                return true;
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
                winInfo = [bigBoardState, "diagonal-win", 1];
                return true;
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
                winInfo = [bigBoardState, "diagonal-win", 2];
                return true;
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
            winInfo = [bigBoardState];
            return true;
        }
        return false;
    }

    const getBoardState = ()=>{
        return bigBoardState;
    }

    const getWinInfo = ()=>{
        return winInfo;
    }

    const getSmallCellWinInfo = ()=>{
        return smallCellWinInfo;
    }

    initialize();
    return{initialize, printToConsole, makeMove, getBoardState, getWinInfo, getSmallCellWinInfo};
})();

const Game = (function(){
    
    let currPlayer = 'x';
    let xScore = 0;
    let oScore = 0;

    const reset = ()=>{
        currPlayer = 'x';
        BigBoard.initialize();
        DisplayController.reset();
        DisplayController.updateMsgBoard(BigBoard.getBoardState());
        DisplayController.updatePlayerIndicator(currPlayer);
    }

    const makeMove = (bigRow, bigCol, row, col)=>{
        if(BigBoard.makeMove(currPlayer, bigRow, bigCol, row, col) == true){
            DisplayController.drawSymbol(currPlayer, bigRow, bigCol, row, col);
            if(BigBoard.getSmallCellWinInfo() != undefined){
                DisplayController.animateBigBoardCell(bigRow, bigCol, BigBoard.getSmallCellWinInfo());
            }
            if(BigBoard.getBoardState() == "x-win"){
                xScore++;
                DisplayController.updateScore(xScore, oScore);
            }
            else if(BigBoard.getBoardState() == "o-win"){
                oScore++;
                DisplayController.updateScore(xScore, oScore);
            }
            if(BigBoard.getBoardState() != "in-play"){
                DisplayController.animateRoundEnd(BigBoard.getWinInfo());
                DisplayController.updateMsgBoard(BigBoard.getBoardState());
            }
            currPlayer = (currPlayer == 'x')? 'o' : 'x';
            DisplayController.updatePlayerIndicator(currPlayer);
            DisplayController.highlightSmallBoard(row, col);
        }
    }

    return{makeMove, reset};

})();

const DisplayController = (function(){

    let x_SVG = '<svg class="x-svg" fill="#000000" height="0px" width="0px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 460.775 460.775" xml:space="preserve"><path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55 c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55 c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505 c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55 l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719 c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"></path></svg>'
    let o_SVG = '<svg class="o-svg" width="0px" height="0px" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000"><path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>'
    let draw_SVG = '<svg class="draw-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>minus-thick</title><path d="M20 14H4V10H20" /></svg>'

    let xScoreElement = document.querySelector(".x-score");
    let oScoreElement = document.querySelector(".o-score");
    let msgBoard = document.querySelector(".msg-board"); 
    let destination = document.querySelector(".game-container");
    let highlightedBoard = undefined;
    
    let helpButton = document.querySelector(".help-button");
    helpButton.onclick = ()=>{
        document.querySelector("footer").scrollIntoView({behavior: 'smooth'});
    }

    let initialize = (destination = document.body)=>{
        this.gameBoard = document.createElement('table');
        this.bigTbody = document.createElement('tbody');
        this.gameBoard.appendChild(this.bigTbody);
        this.gameBoard.setAttribute("class","game-board");
        
        for(let bigRow=0; bigRow<3; bigRow++){
            this.bigTbody.insertRow(bigRow);
            for(let bigCol=0; bigCol<3; bigCol++){
                this.bigTbody.rows[bigRow].insertCell(bigCol);
                this.bigTbody.rows[bigRow].cells[bigCol].setAttribute("class", "big-board-cell");
                this.bigTbody.rows[bigRow].cells[bigCol].appendChild(createSmallBoardElement(bigRow, bigCol));
            }
        }
        
        this.bigTbody.onclick = (e)=>{
            if(e.target.classList.contains("small-board-cell")){
                Game.makeMove(e.target.dataset.bigrow, e.target.dataset.bigcol, e.target.dataset.row, e.target.dataset.col);
            }
        }
        
        destination.appendChild(this.gameBoard);

        this.restartButton = document.createElement('button');
        this.restartButton.setAttribute("class", "restart-button");
        this.restartButton.innerText = "Restart";

        this.restartButton.onclick = ()=>{
            Game.reset();
        }
        
        destination.appendChild(this.restartButton);
    };

    function createSmallBoardElement(bigRow, bigCol){
        let table = document.createElement('table');
        let tbody = document.createElement('tbody');
        table.appendChild(tbody);
        table.setAttribute("class", "small-board");

        for(let row=0; row<3; row++){
            tbody.insertRow(row);
            for(let col=0; col<3; col++){
                tbody.rows[row].insertCell(col);
                tbody.rows[row].cells[col].setAttribute("class", "small-board-cell");
                tbody.rows[row].cells[col].setAttribute('data-bigRow',bigRow);
                tbody.rows[row].cells[col].setAttribute('data-bigCol',bigCol);
                tbody.rows[row].cells[col].setAttribute('data-row',row);
                tbody.rows[row].cells[col].setAttribute('data-col',col);
            }
        }

        return table;
    };

    let drawSymbol = (symbol, bigRow, bigCol, row, col)=>{
        let symbol_SVG = (symbol == 'x')? x_SVG : o_SVG;
        let smallBoardCell = this.bigTbody.rows[bigRow].cells[bigCol].querySelector(".small-board tbody").rows[row].cells[col];
        smallBoardCell.innerHTML = symbol_SVG;
    };

    let updateScore = (xScore, oScore)=>{
        xScoreElement.innerText = xScore;
        oScoreElement.innerText = oScore;
    };

    let updatePlayerIndicator = (currPlayer)=>{
        if(currPlayer == 'x'){
            xScoreElement.parentElement.classList.add("highlight");
            oScoreElement.parentElement.classList.remove("highlight");
        }
        else{
            xScoreElement.parentElement.classList.remove("highlight");
            oScoreElement.parentElement.classList.add("highlight");    
        }
    };

    let updateMsgBoard = (bigBoardState)=>{
        if(bigBoardState === "x-win"){
            msgBoard.innerHTML = '<svg fill="#f5f5f5" height="50px" width="50px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 460.775 460.775" xml:space="preserve"><path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55 c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55 c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505 c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55 l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719 c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"></path></svg> Wins!'
        }
        else if(bigBoardState === "o-win"){
            msgBoard.innerHTML = '<svg width="75px" height="75px" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#f5f5f5"><path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>Wins!' 
        }
        else if(bigBoardState === "draw"){
            msgBoard.innerText = 'Draw!';
        }
        else if(bigBoardState === "in-play"){
            msgBoard.innerText = 'Super Tic Tac Toe';
        }
    }

    let reset = ()=>{
        this.gameBoard.remove();
        this.restartButton.remove();
        initialize(destination);
    };

    let highlightSmallBoard = (bigRow, bigCol)=>{
        if(highlightedBoard != undefined){
            highlightedBoard.classList.remove("highlight");
        }
        highlightedBoard = this.bigTbody.rows[bigRow].cells[bigCol].querySelector(".small-board");
        highlightedBoard.classList.add("highlight");
    };

    let animateBigBoardCell = (bigRow, bigCol, smallCellWinInfo)=>{
        let symbol_SVG = (smallCellWinInfo[0] == 'x-win')? x_SVG : (smallCellWinInfo[0] == 'o-win')? o_SVG : draw_SVG;
        let wrapper= document.createElement('div');
        wrapper.innerHTML= symbol_SVG;
        let symbol_SVG_element = wrapper.firstChild;
        let bigBoardCell = this.bigTbody.rows[bigRow].cells[bigCol];
        let smallBoard = bigBoardCell.querySelector(".small-board");
        let smallTbody = smallBoard.querySelector("tbody");
        let time = 0;
        
        symbol_SVG_element.classList.add("hide");
        bigBoardCell.appendChild(symbol_SVG_element);
        
        function highlightCell(row, col, ms){
            setTimeout(()=>smallTbody.rows[row].cells[col].querySelector("svg").classList.toggle("highlight"), ms);
        }

        if(smallCellWinInfo[0] == "draw"){
            highlightCell(0, 0, time+=100);
            highlightCell(0, 1, time+=100);
            highlightCell(1, 0, time);
            highlightCell(0, 2, time+=100);
            highlightCell(1, 1, time);
            highlightCell(2, 0, time);
            highlightCell(1, 2, time+=100);
            highlightCell(2, 1, time);
            highlightCell(2, 2, time+=100);
        }
        else if(smallCellWinInfo[1] == "row-win"){
            highlightCell(smallCellWinInfo[2], 0, time+=100);
            highlightCell(smallCellWinInfo[2], 1, time+=100);
            highlightCell(smallCellWinInfo[2], 2, time+=100);
        }
        else if(smallCellWinInfo[1] == "col-win"){
            highlightCell(0, smallCellWinInfo[2], time+=100);
            highlightCell(1, smallCellWinInfo[2], time+=100);
            highlightCell(2, smallCellWinInfo[2], time+=100);
        }
        else if(smallCellWinInfo[1] == "diagonal-win"){
            if(smallCellWinInfo[2] == 1){
                highlightCell(0, 0, time+=100);
                highlightCell(1, 1, time+=100);
                highlightCell(2, 2, time+=100);
            }
            else{
                highlightCell(2, 0, time+=100);
                highlightCell(1, 1, time+=100);
                highlightCell(0, 2, time+=100);
            }
        }
        

        setTimeout(()=>smallBoard.classList.add("hide"), time+=700);
        setTimeout(()=>symbol_SVG_element.classList.remove("hide"), time+=100);

    };

    let animateRoundEnd = (winInfo)=>{
        console.log("winInfo:",winInfo);
        let time = 1500;

        function highlightCell(row, col, ms){
            setTimeout(()=>this.bigTbody.rows[row].cells[col].lastChild.classList.toggle("highlight"), ms);
        }

        if(winInfo[0] == "draw"){
            highlightCell(0, 0, time+=100);
            highlightCell(0, 1, time+=100);
            highlightCell(1, 0, time);
            highlightCell(0, 2, time+=100);
            highlightCell(1, 1, time);
            highlightCell(2, 0, time);
            highlightCell(1, 2, time+=100);
            highlightCell(2, 1, time);
            highlightCell(2, 2, time+=100);
        }
        else if(winInfo[1] == "row-win"){
            highlightCell(winInfo[2], 0, time+=100);
            highlightCell(winInfo[2], 1, time+=100);
            highlightCell(winInfo[2], 2, time+=100);
        }
        else if(winInfo[1] == "col-win"){
            highlightCell(0, winInfo[2], time+=100);
            highlightCell(1, winInfo[2], time+=100);
            highlightCell(2, winInfo[2], time+=100);
        }
        else if(winInfo[1] == "diagonal-win"){
            if(winInfo[2] == 1){
                highlightCell(0, 0, time+=100);
                highlightCell(1, 1, time+=100);
                highlightCell(2, 2, time+=100);
            }
            else{
                highlightCell(2, 0, time+=100);
                highlightCell(1, 1, time+=100);
                highlightCell(0, 2, time+=100);
            }
        }
    };

    initialize(destination);

    return{drawSymbol, updateScore, updatePlayerIndicator, updateMsgBoard, reset, highlightSmallBoard, animateBigBoardCell, animateRoundEnd};
})();
