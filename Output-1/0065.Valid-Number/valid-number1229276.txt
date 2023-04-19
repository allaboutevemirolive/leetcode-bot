// https://leetcode.com/problems/valid-number/solutions/1229276/rust-simple-dirty-solution/
impl Solution {
    pub fn is_number(s: String) -> bool {
        let mut eIdx: i32 = -1;
        let mut decIdx: i32 = -1;
        let mut numStarted = false;
        let mut prevCh = '\0';
        for (i, ch) in s.chars().enumerate() {
            let i = i as i32;
            
            match (eIdx, decIdx, prevCh, ch) {
                (_,_,_,'+') | (_,_,_,'-')
                if i == eIdx + 1 
                && i as usize != s.len() -1 => {},
                
                (-1,-1,'0'..='9','.') => {
                    decIdx = i;
                },
                
                (-1,-1,'+','.') | (-1,-1,'-','.') | (-1,-1,'\0','.') 
                if i as usize != s.len() -1 => {
                    decIdx = i;
                },
                
                (-1,_,'0'..='9','e') | (-1,_,'0'..='9','E') | 
                (-1,_,'.','e') | (-1,_,'.','E')
                if i as usize != s.len() -1 && numStarted => {
                    eIdx = i;
                },
                (_,_,_,'0'..='9') => {
                    numStarted = true;
                },
                _ => {
                    return false;
                },
            }
            prevCh = ch;
        }
        true
    }
}