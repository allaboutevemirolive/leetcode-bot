// https://leetcode.com/problems/stamping-the-sequence/solutions/2459666/rust-o-m-n-n-solution/
use std::collections::VecDeque;

impl Solution {
	// working backwards
    pub fn moves_to_stamp(stamp: String, target: String) -> Vec<i32> {
        let mut done: Vec<bool> = vec![false; target.len()];
        let mut queue = VecDeque::new();
        let mut pos = 0;
        let mut count = 0;
		//find whole matches first
        for (i, _) in target.match_indices(&stamp) {
            if i >= pos {
                queue.push_back(i);
                for j in i..i + stamp.len() {
                    done[j] = true;
                }
                count += stamp.len();
                pos = i + stamp.len();
            }
        }

        let mut ans = Vec::new();
		// BFS-like searching for next stamp positions
        while count < target.len() {
            let out = match queue.pop_front() {
                Some(o) => o,
                None => return Vec::new(),
            };
            ans.push(out as i32);
			// look before current position
            if out > 0 && !done[out - 1] {
                let left = out.max(stamp.len()) - stamp.len();
                for i in left..out {
                    if !done[i] {
						// FIRST match
                        if let Some((offset, _)) = stamp.match_indices(&target[i..out]).next() {
                            if (i > 0 && done[i - 1] && i >= offset)
                            || offset == 0 {
                                for j in i..out {
                                    done[j] = true;
                                }
                                count += out - i;
                                queue.push_back(i - offset);
                                break;
                            }
                        }
                    }
                }
            }
			// look after current position
            let after = out + stamp.len();
            if after < target.len() && !done[after] {
                let right = (after + stamp.len()).min(target.len());
                for i in (after..right).rev() {
                    if !done[i] {
						// LAST match
                        if let Some((offset, _)) = stamp.match_indices(&target[after..=i]).last() {
                            if (i < target.len() - 1 && done[i + 1] && after - offset + stamp.len() <= target.len())
                            || offset + i + 1 - after == stamp.len() {
                                for j in after..=i {
                                    done[j] = true;
                                }
                                count += i - after + 1;
                                queue.push_back(after - offset);
                            }
                        }
                    }
                }
            }
        }
        ans.extend(queue.iter().map(|&x| x as i32));
        ans.reverse();
        ans
    }
}