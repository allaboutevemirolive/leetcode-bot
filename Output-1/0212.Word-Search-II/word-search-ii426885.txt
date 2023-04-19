// https://leetcode.com/problems/word-search-ii/solutions/426885/rust-solution-beat-81-in-speed-and-100-in-memory/
type Int = i32;

#[derive(Clone, Debug, Default)]
pub struct Trie {
    is_word: bool,
    children: [Option<Box<Trie>>; 26],
}

impl Trie {
    /// Creates an empty Trie tree
    pub fn new() -> Self {
        Default::default()
    }

    /// Insert a word into the Trie tree
    /// 
    /// # Arguments
    /// * 'word' - A String that holds the word to search
    pub fn insert(&mut self, word: String) {
        let word = word.chars();
        let mut node = self;

        for c in word {
            let ind = c as usize - 'a' as usize;

            node = node.children[ind].get_or_insert_with(|| {
                Box::new(Trie::new())
            });
        }

        node.is_word = true;
    }

    pub fn search(&self, word: &String) -> bool {
        let word = word.chars();
        let mut node = self;

        for c in word {
            let ind = c as usize - 'a' as usize;

            match &node.children[ind] {
                Some(child) => node = child,
                None => return false,
            }
        }

        return node.is_word
    }

    pub fn starts_with(&self, prefix: &String) -> bool {
        let prefix = prefix.chars();
        let mut node = self;

        for c in prefix {
            let ind = c as usize - 'a' as usize;

            match &node.children[ind] {
                Some(child) => node = child,
                None => return false,
            }
        }

        return true
    }
}

impl Solution {
    const DIRS: [[Int; 2]; 4] = [[0,-1], [0,1], [-1,0], [1,0]];

    pub fn find_words(board: Vec<Vec<char>>, words: Vec<String>) -> Vec<String> {
        let mut result = Vec::new();
        let mut used = vec![vec![false; board[0].len()]; board.len()];
        // let mut chs = String::new();

        // create a Trie tree and insert all words into the Trie tree
        let mut trie = Trie::new();
        for word in words.iter() {
            trie.insert(word.clone());
        }

        // loop through each cell on the board
        for i in 0..board.len() {
            for j in 0..board[0].len() {
                let mut new_chs = String::new();
                new_chs.push(board[i][j]);
            
                if trie.starts_with(&new_chs) {
                    used[i][j] = true;
                    Solution::search_words(&board, &mut new_chs, &trie, &mut used, i, j, &mut result);
                    used[i][j] = false;
                }
            }
        }

        return result
    }

    fn search_words(
        board: &Vec<Vec<char>>, 
        chs: &mut String,
        trie: &Trie,
        used: &mut Vec<Vec<bool>>,
        x: usize,
        y: usize,
        result: &mut Vec<String>
    ) {
        let (m, n) = (board.len() as Int, board[0].len() as Int);

        // determine end condition  
        if trie.search(chs) && result.contains(&chs) == false {
            result.push(chs.clone());
        }

        // loop thru directions and enter recursively dfs
        for dir in Solution::DIRS.iter() {
            let (new_x, new_y) = (
                match x as Int + dir[0] {
                    nx if nx<0 => continue,
                    nx if nx>=m => continue,
                    nx => nx as usize,
                },
                match y as Int + dir[1] {
                    ny if ny<0 => continue,
                    ny if ny>=n => continue,
                    ny => ny as usize,
                }
            );
            
            let mut new_chs: String = chs.clone();
            new_chs.push(board[new_x][new_y]);

            if trie.starts_with(&new_chs) == true && used[new_x][new_y] == false {
                used[new_x][new_y] = true;
                Solution::search_words(board, &mut new_chs, trie, used, new_x, new_y, result);
                
                // backtrack
                used[new_x][new_y] = false;
            } else {
                continue
            }
        }
    }
}