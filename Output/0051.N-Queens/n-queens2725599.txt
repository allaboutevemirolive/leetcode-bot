// https://leetcode.com/problems/n-queens/solutions/2725599/rust-backtracking/
use std::collections::HashSet;
impl Solution {
    pub fn solve_n_queens(n: i32) -> Vec<Vec<String>> {
        
        fn is_placeable(board: &Vec<Vec<char>>, x: usize, y: usize) -> bool {
            let b_size = board.len();
                        
            for p_y in 0..y {
                if board[p_y][x] != '.' { return false; }
            }
            
            let (mut cur_x, mut cur_y) = (x, y);
            while cur_x < b_size - 1 && cur_y > 0 {
                cur_x += 1;
                cur_y -= 1;
                if board[cur_y][cur_x] != '.' { return false; };
            } 
            
            let (mut cur_x, mut cur_y) = (x, y);
            while cur_x > 0 && cur_y > 0 {
                cur_x -= 1;
                cur_y -= 1;
                if board[cur_y][cur_x] != '.' { return false; };
            }
            
            true
        }
        
        fn helper(
            solns: &mut HashSet<Vec<String>>,
            board: &mut Vec<Vec<char>>,
            target: usize,
            x: usize,
            y: usize
        ) {            
            if is_placeable(&board, x, y) {
                board[y][x] = 'Q';
                
                if y + 1 == target {
                    solns.insert(
                        board.clone().into_iter().map(|row| {
                            row.into_iter().collect::<String>()
                        }).collect::<Vec<String>>()
                    );
                } else {
                    if x > 1 {
                        for next_x in 0..=(x-2) {
                            helper(solns, board, target, next_x, y+1);
                        }
                    }

                    if x + 2 < target {
                        for next_x in x + 2..target {
                            helper(solns, board, target, next_x, y+1);
                        }
                    }
                }
                
                board[y][x] = '.';
            }
        }
        
        let mut solns = HashSet::<Vec<String>>::new();
        let n = n as usize;
        for x in 0..n {
            helper(
                &mut solns,
                &mut vec![vec!['.';n as usize];n as usize],
                n,
                x,
                0
            );
        }
        
        solns.into_iter().collect::<Vec<Vec<String>>>()
    }
}