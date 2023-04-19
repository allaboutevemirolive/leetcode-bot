// https://leetcode.com/problems/word-search-ii/solutions/3302660/rust-the-fastest-63ms-custom-dictonary-implementation-with-o-1-for-check-next-char/
impl Solution {
    pub fn find_words(mut board: Vec<Vec<char>>, words: Vec<String>) -> Vec<String> {
        fn sub(board: &mut Vec<Vec<char>>, x:usize, y:usize, dict: &mut Vec<(usize, bool)>, mut dpos:usize, t:&mut String, res:&mut Vec<String>) {
            let c = board[y][x];
            let index = dpos + (c as u8 - b'a') as usize;
            if (!dict[index].1) && (dict[index].0 == 0) {
                return;
            }
            const VISITED: char = '#';
            board[y][x] = VISITED;
            t.push(c);

            if dict[index].1 { //check if word present
                dict[index].1 = false; //delete word flag
                res.push(t.clone()); //push temporary string to result
            }
            if dict[index].0 !=0 {
                dpos = dict[index].0;
                if x < board[0].len()-1 && board[y][x + 1] != VISITED {sub(board, x + 1, y, dict, dpos, t, res);};
                if x > 0                && board[y][x - 1] != VISITED {sub(board, x - 1, y, dict, dpos, t, res);};
                if y < board.len()-1  && board[y + 1][x] != VISITED {sub(board, x, y + 1, dict, dpos, t, res);};
                if y > 0              && board[y - 1][x] != VISITED {sub(board, x, y - 1, dict, dpos, t, res);};
            }
            board[y][x] = c;
            t.pop();
        }

        //first in pair - next index, second - word present flag
        //each node in the vector contains block of 26 pair for each latin alphabet char
        let mut dict = vec![(0usize, false); 26]; 
        for word in words {
            let mut dpos = 0;
            for c in word.as_bytes().iter().enumerate() {
                let index = dpos + (c.1 - b'a') as usize;
                if c.0 == word.len()-1 {
                    dict[index].1 = true;    //mark word is present
                } else if dict[index].0 != 0 { // check if the next node is present
                    dpos = dict[index].0;
                } else { // add new node
                    dpos = dict.len();
                    dict[index].0 = dict.len();
                    dict.extend_from_slice(&[(0usize, false); 26]);
                }
            }
        }
         
        let mut res = vec![];
        for y in 0 .. board.len() {
            for x in 0 .. board[0].len() {
                sub(&mut board, x, y, &mut dict, 0, &mut String::new(), &mut res);
            }
        }
        //println!("{:?}", res);
        return res;
   }
}