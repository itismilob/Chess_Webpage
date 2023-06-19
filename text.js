function king_check(color){
    if(color === "white"){
        // white king loc
        let king_cell;
        game_board.forEach((line)=>{
            line.forEach((cell)=>{
                if(cell.value === 1) king_cell = cell;
            });
        });
        let diagonal_distance = [];
        diagonal_distance.push(check_diagonal_distance(king_cell.x, king_cell.y));
        diagonal_distance.push(check_diagonal_distance(king_cell.x, 7-king_cell.y));
        diagonal_distance.push(check_diagonal_distance(7-king_cell.x, king_cell.y));
        diagonal_distance.push(check_diagonal_distance(7-king_cell.x, 7-king_cell.y));

        // Pawn check
        if(king_cell.x > 0 && king_cell.y > 0 && game_board[king_cell.x-1][king_cell.y-1].value === 16) {console.log("P check"); return true;}
        if(king_cell.x > 0 && king_cell.y < 7 && game_board[king_cell.x-1][king_cell.y+1].value === 16) {console.log("P check"); return true;}

        // Knight check
        //  top
        if(king_cell.x > 1 && king_cell.y > 0 && game_board[king_cell.x-2][king_cell.y-1].value === 14) {console.log("N check"); return true;}
        if(king_cell.x > 1 && king_cell.y < 7 && game_board[king_cell.x-2][king_cell.y+1].value === 14) {console.log("N check"); return true;}
        //  left
        if(king_cell.x > 0 && king_cell.y > 1 && game_board[king_cell.x-1][king_cell.y-2].value === 14) {console.log("N check"); return true;}
        if(king_cell.x < 7 && king_cell.y > 1 && game_board[king_cell.x+1][king_cell.y-2].value === 14) {console.log("N check"); return true;}
        //  right
        if(king_cell.x > 0 && king_cell.y < 6 && game_board[king_cell.x-1][king_cell.y+2].value === 14) {console.log("N check"); return true;}
        if(king_cell.x > 7 && king_cell.y < 6 && game_board[king_cell.x+1][king_cell.y+2].value === 14) {console.log("N check"); return true;}
        //  bottom
        if(king_cell.x < 6 && king_cell.y > 0 && game_board[king_cell.x+2][king_cell.y-1].value === 14) {console.log("N check"); return true;}
        if(king_cell.x < 6 && king_cell.y < 7 && game_board[king_cell.x+2][king_cell.y+1].value === 14) {console.log("N check"); return true;}

        // Bishop check
        //  up left -1, -1
        for(let i=1;i<=diagonal_distance[0];i++){
            if(game_board[king_cell.x-i][king_cell.y-i].value === 0) continue;
            if(game_board[king_cell.x-i][king_cell.y-i].value === 13) {console.log("B check"); return true;}
            else break;
        }
        //  up right -1, +1
        for(let i=1;i<=diagonal_distance[1];i++){
            if(game_board[king_cell.x-i][king_cell.y+i].value === 0) continue;
            if(game_board[king_cell.x-i][king_cell.y+i].value === 13) {console.log("B check"); return true;}
            else break;
        }
        //  down left +1, -1
        for(let i=1;i<=diagonal_distance[2];i++){
            if(game_board[king_cell.x+i][king_cell.y-i].value === 0) continue;
            if(game_board[king_cell.x+i][king_cell.y-i].value === 13) {console.log("B check"); return true;}
            else break;
        }
        //  down right +1, +1
        for(let i=1;i<=diagonal_distance[3];i++){
            if(game_board[king_cell.x+i][king_cell.y+i].value === 0) continue;
            if(game_board[king_cell.x+i][king_cell.y+i].value === 13) {console.log("B check"); return true;}
            else break;
        }

        // Rook check
        //  up
        for(let i=1;i<=king_cell.x;i++){
            if(game_board[king_cell.x-i][king_cell.y].value === 0) continue;
            if(game_board[king_cell.x-i][king_cell.y].value === 15) {console.log("R check"); return true;}
            else break;
        }
        //  down
        for(let i=1;i<8-king_cell.x;i++){
            if(game_board[king_cell.x+i][king_cell.y].value === 0) continue;
            if(game_board[king_cell.x+i][king_cell.y].value === 15) {console.log("R check"); return true;}
            else break;
        }
        //  left
        for(let i=1;i<=king_cell.y;i++){
            if(game_board[king_cell.x][king_cell.y-i].value === 0) continue;
            if(game_board[king_cell.x][king_cell.y-i].value === 15) {console.log("R check"); return true;}
            else break;
        }
        //  right
        for(let i=1;i<8-king_cell.y;i++){
            if(game_board[king_cell.x][king_cell.y+i].value === 0) continue;
            if(game_board[king_cell.x][king_cell.y+i].value === 15) {console.log("R check"); return true;}
            else break;
        }

        // Queen check
        //  Queen - Bishop
        //  up left -1, -1
        for(let i=1;i<=diagonal_distance[0];i++){
            if(game_board[king_cell.x-i][king_cell.y-i].value === 0) continue;
            if(game_board[king_cell.x-i][king_cell.y-i].value === 12) {console.log("Q check"); return true;}
            else break;
        }
        //  up right -1, +1
        for(let i=1;i<=diagonal_distance[1];i++){
            if(game_board[king_cell.x-i][king_cell.y+i].value === 0) continue;
            if(game_board[king_cell.x-i][king_cell.y+i].value === 12) {console.log("Q check"); return true;}
            else break;
        }
        //  down left +1, -1
        for(let i=1;i<=diagonal_distance[2];i++){
            if(game_board[king_cell.x+i][king_cell.y-i].value === 0) continue;
            if(game_board[king_cell.x+i][king_cell.y-i].value === 12) {console.log("Q check"); return true;}
            else break;
        }
        //  down right +1, +1
        for(let i=1;i<=diagonal_distance[3];i++){
            if(game_board[king_cell.x+i][king_cell.y+i].value === 0) continue;
            if(game_board[king_cell.x+i][king_cell.y+i].value === 12) {console.log("Q check"); return true;}
            else break;
        }
        // Queen - Rook
        //  up
        for(let i=1;i<=king_cell.x;i++){
            if(game_board[king_cell.x-i][king_cell.y].value === 0) continue;
            if(game_board[king_cell.x-i][king_cell.y].value === 12) {console.log("Q check"); return true;}
            else break;
        }
        //  down
        for(let i=1;i<8-king_cell.x;i++){
            if(game_board[king_cell.x+i][king_cell.y].value === 0) continue;
            if(game_board[king_cell.x+i][king_cell.y].value === 12) {console.log("Q check"); return true;}
            else break;
        }
        //  left
        for(let i=1;i<=king_cell.y;i++){
            if(game_board[king_cell.x][king_cell.y-i].value === 0) continue;
            if(game_board[king_cell.x][king_cell.y-i].value === 12) {console.log("Q check"); return true;}
            else break;
        }
        //  right
        for(let i=1;i<8-king_cell.y;i++){
            if(game_board[king_cell.x][king_cell.y+i].value === 0) continue;
            if(game_board[king_cell.x][king_cell.y+i].value === 12) {console.log("Q check"); return true;}
            else break;
        }

        return false;
    }else{
        // black king loc
        let king_cell;
        game_board.forEach((line) => {
            line.forEach((cell) => {
                if (cell.value === 11) king_cell = cell;
            });
        });

        let diagonal_distance = [];
        diagonal_distance.push(check_diagonal_distance(king_cell.x, king_cell.y));
        diagonal_distance.push(check_diagonal_distance(king_cell.x, 7 - king_cell.y));
        diagonal_distance.push(check_diagonal_distance(7 - king_cell.x, king_cell.y));
        diagonal_distance.push(check_diagonal_distance(7 - king_cell.x, 7 - king_cell.y));

        // Pawn check
        if (king_cell.x < 7 && king_cell.y > 0 && game_board[king_cell.x+1][king_cell.y-1].value === 6) {console.log("P check");return true;}
        if (king_cell.x < 7 && king_cell.y < 7 && game_board[king_cell.x+1][king_cell.y+1].value === 6) {console.log("P check");return true;}

        // Knight check
        //  top
        if (king_cell.x > 1 && king_cell.y > 0 && game_board[king_cell.x-2][king_cell.y-1].value === 4) {console.log("N check");return true;}
        if (king_cell.x > 1 && king_cell.y < 7 && game_board[king_cell.x-2][king_cell.y+1].value === 4) {console.log("N check");return true;}
        //  left
        if (king_cell.x > 0 && king_cell.y > 1 && game_board[king_cell.x-1][king_cell.y-2].value === 4) {console.log("N check");return true;}
        if (king_cell.x < 7 && king_cell.y > 1 && game_board[king_cell.x+1][king_cell.y-2].value === 4) {console.log("N check");return true;}
        //  right
        if (king_cell.x > 0 && king_cell.y < 6 && game_board[king_cell.x-1][king_cell.y+2].value === 4) {console.log("N check");return true;}
        if (king_cell.x > 7 && king_cell.y < 6 && game_board[king_cell.x+1][king_cell.y+2].value === 4) {console.log("N check");return true;}
        //  bottom
        if (king_cell.x < 6 && king_cell.y > 0 && game_board[king_cell.x+2][king_cell.y-1].value === 4) {console.log("N check");return true;}
        if (king_cell.x < 6 && king_cell.y < 7 && game_board[king_cell.x+2][king_cell.y+1].value === 4) {console.log("N check");return true;}

        // Bishop check
        //  up left -1, -1
        for (let i = 1; i <= diagonal_distance[0]; i++) {
            if (game_board[king_cell.x - i][king_cell.y - i].value === 0) continue;
            if (game_board[king_cell.x - i][king_cell.y - i].value === 3) {console.log("B check");return true;}
            else break;
        }
        //  up right -1, +1
        for (let i = 1; i <= diagonal_distance[1]; i++) {
            if (game_board[king_cell.x - i][king_cell.y + i].value === 0) continue;
            if (game_board[king_cell.x - i][king_cell.y + i].value === 3) {console.log("B check");return true;}
            else break;
        }
        //  down left +1, -1
        for (let i = 1; i <= diagonal_distance[2]; i++) {
            if (game_board[king_cell.x + i][king_cell.y - i].value === 0) continue;
            if (game_board[king_cell.x + i][king_cell.y - i].value === 3) {console.log("B check");return true;}
            else break;
        }
        //  down right +1, +1
        for (let i = 1; i <= diagonal_distance[3]; i++) {
            if (game_board[king_cell.x + i][king_cell.y + i].value === 0) continue;
            if (game_board[king_cell.x + i][king_cell.y + i].value === 3) {console.log("B check");return true;}
            else break;
        }

        // Rook check
        //  up
        for (let i = 1; i <= king_cell.x; i++) {
            if (game_board[king_cell.x - i][king_cell.y].value === 0) continue;
            if (game_board[king_cell.x - i][king_cell.y].value === 5) {console.log("R check");return true;}
            else break;
        }
        //  down
        for (let i = 1; i < 8 - king_cell.x; i++) {
            if (game_board[king_cell.x + i][king_cell.y].value === 0) continue;
            if (game_board[king_cell.x + i][king_cell.y].value === 5) {console.log("R check");return true;}
            else break;
        }
        //  left
        for (let i = 1; i <= king_cell.y; i++) {
            if (game_board[king_cell.x][king_cell.y - i].value === 0) continue;
            if (game_board[king_cell.x][king_cell.y - i].value === 5) {console.log("R check");return true;}
            else break;
        }
        //  right
        for (let i = 1; i < 8 - king_cell.y; i++) {
            if (game_board[king_cell.x][king_cell.y + i].value === 0) continue;
            if (game_board[king_cell.x][king_cell.y + i].value === 5) {console.log("R check");return true;}
            else break;
        }

        // Queen check
        //  Queen - Bishop
        //  up left -1, -1
        for (let i = 1; i <= diagonal_distance[0]; i++) {
            if (game_board[king_cell.x - i][king_cell.y - i].value === 0) continue;
            if (game_board[king_cell.x - i][king_cell.y - i].value === 2) {console.log("Q check");return true;}
            else break;
        }
        //  up right -1, +1
        for (let i = 1; i <= diagonal_distance[1]; i++) {
            if (game_board[king_cell.x - i][king_cell.y + i].value === 0) continue;
            if (game_board[king_cell.x - i][king_cell.y + i].value === 2) {console.log("Q check");return true;}
            else break;
        }
        //  down left +1, -1
        for (let i = 1; i <= diagonal_distance[2]; i++) {
            if (game_board[king_cell.x + i][king_cell.y - i].value === 0) continue;
            if (game_board[king_cell.x + i][king_cell.y - i].value === 2) {console.log("Q check");return true;}
            else break;
        }
        //  down right +1, +1
        for (let i = 1; i <= diagonal_distance[3]; i++) {
            if (game_board[king_cell.x + i][king_cell.y + i].value === 0) continue;
            if (game_board[king_cell.x + i][king_cell.y + i].value === 2) {console.log("Q check");return true;}
            else break;
        }
        // Queen - Rook
        //  up
        for (let i = 1; i <= king_cell.x; i++) {
            if (game_board[king_cell.x - i][king_cell.y].value === 0) continue;
            if (game_board[king_cell.x - i][king_cell.y].value === 2) {console.log("Q check");return true;}
            else break;
        }
        //  down
        for (let i = 1; i < 8 - king_cell.x; i++) {
            if (game_board[king_cell.x + i][king_cell.y].value === 0) continue;
            if (game_board[king_cell.x + i][king_cell.y].value === 2) {console.log("Q check");return true;}
            else break;
        }
        //  left
        for (let i = 1; i <= king_cell.y; i++) {
            if (game_board[king_cell.x][king_cell.y - i].value === 0) continue;
            if (game_board[king_cell.x][king_cell.y - i].value === 2) {console.log("Q check");return true;}
            else break;
        }
        //  right
        for (let i = 1; i < 8 - king_cell.y; i++) {
            if (game_board[king_cell.x][king_cell.y + i].value === 0) continue;
            if (game_board[king_cell.x][king_cell.y + i].value === 2) {console.log("Q check");return true;}
            else break;
        }

        return false;
    }
}