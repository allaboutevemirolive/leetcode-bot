// https://leetcode.com/problems/stamping-the-sequence/solutions/2459912/rust-iterative-stamping-backwards-3-ms/
const UNKNOWN: u8 = b'?';

impl Solution {
    pub fn moves_to_stamp(stamp: String, target: String) -> Vec<i32> {
        let st = stamp.as_bytes();
        let ta = target.as_bytes();
        let N_s = st.len();
        let N_t = ta.len();
        if N_s > N_t {
            return vec![];
        }
        if N_s == N_t {
            if stamp == target {
                return vec![ 0 ];
            }
            return vec![];
        }
        let max_index = N_t - N_s;  // valid indices are 0 ..= max_index
        if st[0] != ta[0] || st.last().unwrap() != ta.last().unwrap() {
            return vec![];
        }
        // Working backwards: can we convert `target` into "?" * N_t?
        let mut buf: Vec<u8> = ta.to_vec();
        let mut remaining: usize = buf.len();  // count of non-`?` characters in `buf`
        // There is no point in stamping the same place twice.
        let mut budget = max_index + 1;  // count of `false`s in `idx_written`
        let mut idx_written = vec![ false; budget ];
        let mut out: Vec<i32> = vec![];  // reverse before returning
        loop {
            let starting_budget = budget.clone();
            // Not using `buf.windows(N_s)` because we want to mutate `buf`.
            'per_site: for i in 0 ..= max_index {
                // if seen on previous pass, skip
                if idx_written[i] { continue 'per_site; }
                // if this site does not match, skip
                {
                    let mut all_unknown = true;
                    for j in 0 .. N_s {
                        if buf[j+i] == st[j] {
                            all_unknown = false;
                        } else if buf[j+i] == UNKNOWN {
                        } else { continue 'per_site; }
                    }
                    if all_unknown { continue 'per_site; }
                }
                // Now, given that we do have a match, we inverse-stamp the buffer.
                idx_written[i] = true;
                budget -= 1;
                out.push(i as i32);
                for j in i .. i+N_s {
                    if buf[j] == UNKNOWN { continue; }
                    buf[j] = UNKNOWN;
                    remaining -= 1;
                }
                if remaining == 0 {
                    out.reverse();
                    return out;
                }
            }
            // If this pass failed to find anything at all,
            // future passes will not find anything either.
            if starting_budget == budget {
                return vec![];
            }
        }
        unreachable!();
    }
}