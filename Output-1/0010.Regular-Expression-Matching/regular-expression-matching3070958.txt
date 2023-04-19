// https://leetcode.com/problems/regular-expression-matching/solutions/3070958/rust-with-nfa/
struct State {
    ch: u8,
    wildcard: bool,
}

impl Solution {
    pub fn is_match(s: String, p: String) -> bool {
        // Build NFA states from p
        let states: Vec<State> = p
            .bytes()
            .enumerate()
            .filter_map(|(i, ch)| {
                if ch == b'*' {
                    None
                } else {
                    Some(State {
                        ch,
                        wildcard: p.as_bytes().get(i + 1).copied() == Some(b'*'),
                    })
                }
            })
            .chain([State {
                ch: 0,
                wildcard: false,
            }])
            .collect();
        let state_count = states.len();

        let mut cur_states = vec![false; state_count];
        let add_state = |dest: &mut Vec<bool>, mut i: usize| {
            while !dest[i] {
                dest[i] = true;
                if states[i].wildcard {
                    i += 1;
                } else {
                    break;
                }
            }
        };

        // Initialization
        add_state(&mut cur_states, 0);

        // Iterate through s.
        for ch in s.into_bytes() {
            if cur_states.is_empty() {
                break;
            }
            let mut new_states = vec![false; state_count];
            for i in 0..state_count {
                if cur_states[i] && (states[i].ch == b'.' || states[i].ch == ch) {
                    if states[i].wildcard {
                        add_state(&mut new_states, i);
                    } else {
                        add_state(&mut new_states, i + 1);
                    }
                }
            }
            cur_states = new_states;
        }

        cur_states.last().copied().unwrap_or(false)
    }
}