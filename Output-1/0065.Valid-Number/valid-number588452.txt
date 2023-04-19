// https://leetcode.com/problems/valid-number/solutions/588452/rust-dfa-solution-with-comment-0ms-1-9mb-both-100/
impl Solution {
    // deterministic finite automaton
    // Q ∈ {0, 1, 2, 3, 4, 5, 6, 7, 8}
    // Sigma ∈ {+/-, '.', 0-9, ' ', 'e'}
    // end state are {3, 5, 6}, intermediate state are rest of Q
    // ---------  state transition table -----------
    // state    ' '     +/-     0-9     '.'     'e'     other_chars
    // 0 	    0 	    1 	    6 	    2 	    -1  	-1
    // 1 	    -1 	    -1 	    6 	    2 	    -1 	    -1
    // 2 	    -1 	    -1 	    3 	    -1 	    -1 	    -1
    // 3 	    8 	    -1 	    3 	    -1 	    4 	    -1
    // 4 	    -1 	    7 	    5 	    -1 	    -1 	    -1
    // 5 	    8 	    -1 	    5 	    -1 	    -1 	    -1
    // 6 	    8 	    -1 	    6 	    3 	    4 	    -1
    // 7 	    -1 	    -1 	    5 	    -1 	    -1 	    -1
    // 8 	    8 	    -1 	    -1 	    -1 	    -1 	    -1
    pub fn is_number(s: String) -> bool {
        const IS_END_STATE: [bool; 9] = [false, false, false, true, false, true, true, false, true];
        const TRANSITION_TABLE: [[i8; 6]; 9] = [
            [0, 1, 6, 2, -1, -1],
            [-1, -1, 6, 2, -1, -1],
            [-1, -1, 3, -1, -1, -1],
            [8, -1, 3, -1, 4, -1],
            [-1, 7, 5, -1, -1, -1],
            [8, -1, 5, -1, -1, -1],
            [8, -1, 6, 3, 4, -1],
            [-1, -1, 5, -1, -1, -1],
            [8, -1, -1, -1, -1, -1],
        ];
        let mut current_state: isize = 0;

        for byte in s.into_bytes() {
            let _idx = current_state as usize;
            let next_state = match byte {
                b' ' => TRANSITION_TABLE[_idx][0],
                b'+' | b'-' => TRANSITION_TABLE[_idx][1],
                b'.' => TRANSITION_TABLE[_idx][3],
                b'e' => TRANSITION_TABLE[_idx][4],
                48..=57 => TRANSITION_TABLE[_idx][2], // 0-9
                _ => TRANSITION_TABLE[_idx][5],
            };

            if next_state == -1 {
                return false;
            } else {
                current_state = next_state as isize;
            }
        }

        IS_END_STATE[current_state as usize]
    }
}
