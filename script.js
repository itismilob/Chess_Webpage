const chess_board_E = document.querySelector(".chess_board");
const notation_table_E = document.querySelector(".notation_table");
const move_input_E = document.querySelector(".move_input");
const move_btn_E = document.querySelector(".move_btn");
let cells;

const file_char =['a','b','c','d','e','f','g','h'];
const piece_code = ['','K','Q','B','N','R','P'];

let notation = [];
let move = [];
let move_piece;
let move_distance;
let move_direction = [];

let turn = true;
let isMoved = false;
let isTake = false;

let game_board = [
    [15,14,13,12,11,13,14,15],
    [16,16,16,16,16,16,16,16],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [6,6,6,6,6,6,6,6],
    [5,4,3,2,1,3,4,5],
];

// add game table
function add_table() {
    let temp_table = "";
    let temp_color = true;
    for (let i = 0; i < 8; i++) {
        let line = "<div class='line'>";
        for (let j = 0; j < 8; j++) {
            if (temp_color) {
                line += "<div class='cell white' draggable='true'></div>";
            } else {
                line += "<div class='cell black' draggable='true'></div>";
            }
            temp_color = !temp_color;
        }
        temp_color = !temp_color;
        line += `<div class='file'>${file_char[i]}</div></div>`;
        temp_table += line;
    }
    let rank = "<div>";
    for (let i = 8; i > 0; i--) {
        rank += `<div class='rank'>${i}</div>`;
    }
    temp_table += rank + "</div>";
    chess_board_E.innerHTML = temp_table;
    cells = document.querySelectorAll(".cell");
}
// add game table

function update_notation_table(){
    notation_table_E.innerHTML = "";
    for(let i=0;i<notation.length;i++){

        let temp = `<tr>
        <td class="notation_count">${i+1}</td>
        <td class="notation_white">${notation[i][0]}</td>
        <td class="notation_black">${notation[i][1]}</td>
        </tr>`;
        notation_table_E.innerHTML += temp;
    }
}

function update_chess_board(){
    cells.forEach((cell,i)=>{
        let index = game_board[i%8][parseInt(i/8)];

        // change to image
        if(index > 10){
            cell.innerHTML = `${piece_code[index-10]}`;
            cell.style.color = "black";
        }else{
            cell.innerHTML = `${piece_code[index]}`;
            cell.style.color = "white";
        }
    });
}

function add_piece_event(){
    cells.forEach((cell,i)=>{
        cell.addEventListener("click",(e)=>{
            move = [{mR:parseInt(i%8), mF:parseInt(i/8)}];
            move_piece = piece_code[game_board[move[0].mR][move[0].mF]%10];
            console.log(move_piece);
        });

        cell.addEventListener("dragstart",(e)=>{
            move = [{mR:parseInt(i%8), mF:parseInt(i/8)}];
            move_piece = game_board[move[0].mR][move[0].mF];
            isMoved = false;
        });

        cell.addEventListener("dragover",(e)=>{
            e.preventDefault();
        });
        cell.addEventListener("drop",(e)=>{
            e.preventDefault();

            if(isMoved)return;
            isMoved = true;
            isTake = false;

            move.push({mR:parseInt(i%8), mF:parseInt(i/8)});
            move_direction = {mR:move[1].mR - move[0].mR, mF:move[1].mF - move[0].mF};
            move_distance = {mR:Math.abs(move_direction.mR), mF:Math.abs(move_direction.mF)};

            // not piece
            if(move_piece == 0) return;
            // not move
            if(move[0].mR == move[1].mR && move[0].mF == move[1].mF) return;
            // not turn
            if((turn && move_piece > 10) || (!turn && move_piece < 10)){
                console.log("it's not your turn");
                return;
            }
            // not empty -> enemy take
            if(turn && game_board[move[1].mR][move[1].mF] > 10){    //white takes black
                isTake = true;
            }else if(!turn && game_board[move[1].mR][move[1].mF] < 10 && game_board[move[1].mR][move[1].mF] != 0) {  //black takes white
                isTake = true;
            }else if(game_board[move[1].mR][move[1].mF] != 0) return;

            //check can move
            switch(parseInt(move_piece%10)){
                case 1:     //K
                    if(check_king()) return;
                    break;
                case 2:     //Q
                    if(check_queen()) return;
                    break;
                case 3:     //B
                    if(check_bishop()) return;
                    break;
                case 4:     //N
                    if(check_knight()) return;
                    break;
                case 5:     //R
                    if(check_rook()) return;
                    break;
                case 6:     //P
                    if(check_pawn()) return;
                    break;
            }
            //check can move

            //move
            game_board[move[0].mR][move[0].mF] = 0;
            game_board[move[1].mR][move[1].mF] = move_piece;
            update_chess_board();
            //move

            //update notation
            let move_piece_code = piece_code[parseInt(move_piece%10)];
            let move_code;

            if(isTake){
                if(move_piece_code == piece_code[6]) move_piece_code = file_char[move[0].mF];
                move_code = move_piece_code + "x" + file_char[move[1].mF] + Math.abs(8 - move[1].mR);
            }else{
                if(move_piece_code == piece_code[6]) move_piece_code = '';
                move_code = move_piece_code + file_char[move[1].mF] + Math.abs(8 - move[1].mR);
            }

            if(turn){
                notation.push([move_code,""]);
            }else{
                notation[notation.length-1][1] = move_code;
            }
            update_notation_table();
            //update notation

            turn = !turn;
        });
    });
}

function check_rook(){
    if(!(move_distance.mR == 0 || move_distance.mF == 0)) return true;
    if(move_distance.mR == 1 || move_distance.mF == 1) return false;

    if(move_distance.mR > move_distance.mF){    //rank move
        for(let i=1;i<move_distance.mR;i++){
            if(move_direction.mR < 0 && game_board[move[0].mR-i][move[0].mF] != 0) return true;     //move up
            if(move_direction.mR > 0 && game_board[move[0].mR+i][move[0].mF] != 0) return true;     //move down
        }
    }else{                                      //file move
        for(let i=1;i<move_distance.mF;i++){
            if(move_direction.mF < 0 && game_board[move[0].mR][move[0].mF-i] != 0) return true;     //move left
            if(move_direction.mF > 0 && game_board[move[0].mR][move[0].mF+i] != 0) return true;     //move right
        }
    }
    return false;
}

function check_knight(){
    if(!((move_distance.mR == 1 && move_distance.mF == 2) || (move_distance.mR == 2 && move_distance.mF == 1))) return true;
    return false;
}

function check_bishop(){
    if(!(move_distance.mR == move_distance.mF)) return true;
    if(move_distance.mR == 1 && move_distance.mF == 1) return false;

    if(move_direction.mR < 0 && move_direction.mF < 0){     //move up left --
        for(let i=1;i<move_distance.mR;i++){
            if(game_board[move[0].mR-i][move[0].mF-i] != 0) return true;
        }
    }
    if(move_direction.mR > 0 && move_direction.mF > 0){     //move down right ++
        for(let i=1;i<move_distance.mR;i++){
            if(game_board[move[0].mR+i][move[0].mF+i] != 0) return true;
        }
    }
    if(move_direction.mR < 0 && move_direction.mF > 0){     //move up right -+
        for(let i=1;i<move_distance.mR;i++){
            if(game_board[move[0].mR-i][move[0].mF+i] != 0) return true;
        }
    }
    if(move_direction.mR > 0 && move_direction.mF < 0){     //move down left +-
        for(let i=1;i<move_distance.mR;i++){
            if(game_board[move[0].mR+i][move[0].mF-i] != 0) return true;
        }
    }
}

function check_queen(){
    if(!(move_distance.mR == 0 || move_distance.mF == 0) && !(move_distance.mR == move_distance.mF)) return true;

    //rook move
    if(move_distance.mR == 0 || move_distance.mF == 0){
        if(move_distance.mR == 1 || move_distance.mF == 1) return false;
        if(move_distance.mR > move_distance.mF){    //rank move
            for(let i=1;i<move_distance.mR;i++){
                if(move_direction.mR < 0 && game_board[move[0].mR-i][move[0].mF] != 0) return true;     //move up
                if(move_direction.mR > 0 && game_board[move[0].mR+i][move[0].mF] != 0) return true;     //move down
            }
        }else{                                      //file move
            for(let i=1;i<move_distance.mF;i++){
                if(move_direction.mF < 0 && game_board[move[0].mR][move[0].mF-i] != 0) return true;     //move left
                if(move_direction.mF > 0 && game_board[move[0].mR][move[0].mF+i] != 0) return true;     //move right
            }
        }
    }

    //bishop move
    if(move_distance.mR == move_distance.mF){
        if(move_distance.mR == 1 && move_distance.mF == 1) return false;
        if(move_direction.mR < 0 && move_direction.mF < 0){     //move up left --
            for(let i=1;i<move_distance.mR;i++){
                if(game_board[move[0].mR-i][move[0].mF-i] != 0) return true;
            }
        }
        if(move_direction.mR > 0 && move_direction.mF > 0){     //move down right ++
            for(let i=1;i<move_distance.mR;i++){
                if(game_board[move[0].mR+i][move[0].mF+i] != 0) return true;
            }
        }
        if(move_direction.mR < 0 && move_direction.mF > 0){     //move up right -+
            for(let i=1;i<move_distance.mR;i++){
                if(game_board[move[0].mR-i][move[0].mF+i] != 0) return true;
            }
        }
        if(move_direction.mR > 0 && move_direction.mF < 0){     //move down left +-
            for(let i=1;i<move_distance.mR;i++){
                if(game_board[move[0].mR+i][move[0].mF-i] != 0) return true;
            }
        }
    }
    return false;
}

function check_king(){
    // if(!(move_distance.mR <= 1 && move_distance.mF <= 1)) return true;

    let check_list = [];
    //check can move
    check_list.push(check_king_move(move[0].mR-1, move[0].mF-1,turn));
    check_list.push(check_king_move(move[0].mR-1, move[0].mF,turn));
    check_list.push(check_king_move(move[0].mR-1, move[0].mF+1,turn));

    check_list.push(check_king_move(move[0].mR, move[0].mF-1,turn));
    check_list.push(check_king_move(move[0].mR, move[0].mF+1,turn));

    check_list.push(check_king_move(move[0].mR+1, move[0].mF-1,turn));
    check_list.push(check_king_move(move[0].mR+1, move[0].mF,turn));
    check_list.push(check_king_move(move[0].mR+1, move[0].mF+1,turn));

    if(check_list.includes(true)) return true;

    //pawn move
    if(turn){   //white
        if(game_board[move[1].mR-1][move[1].mF-1] == 16 || game_board[move[1].mR-1][move[1].mF+1] == 16) return true;
    }else{      //black
        if(game_board[move[1].mR+1][move[1].mF-1] == 6 || game_board[move[1].mR+1][move[1].mF+1] == 6) return true;
    }

    return false;
    //castling
}

function check_king_move(r,f,c){

    //rook move

    //bishop move

    //knight move

    return false;
}

function check_pawn(){
    if(move_distance.mF != 0) return true;
    if(turn){   //white
        //promotion
        if(move_direction.mR > 0) return true;
        if(move_distance.mR > 2) return true;
        if(move_distance.mR == 1) return false;
        if(move_distance.mR == 2 && move[0].mR == 6 && game_board[5][move[0].mF] == 0) return false;
        return true;
    }else{      //black turn
        if(move_direction.mR < 0) return true;
        if(move_distance.mR > 2) return true;
        if(move_distance.mR == 1) return false;
        if(move_distance.mR == 2 && move[0].mR == 1 && game_board[2][move[0].mF] == 0) return false;
        return true;
    }
}

window.onload = ()=>{
    add_table();
    update_chess_board();
    add_piece_event();

    move_btn_E.addEventListener("click", ()=>{
        let move_input = move_input_E.value;
        if(move_input){
            if(turn){
                notation.push([move_input,""]);
            }else{
                notation[notation.length-1][1] = move_input;
            }
            move_input_E.value = "";
            update_notation_table();
            turn = !turn;
        }
    });

    console.log("window loaded");
};