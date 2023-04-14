// https://leetcode.com/problems/distinct-subsequences/solutions/2414921/rust-top-down-dp-clean-code-easy-to-understand/
use std::collections::HashMap;

pub fn num_distinct(s: impl AsRef<[u8]>, t: impl AsRef<[u8]>) -> i32 {
    let s = s.as_ref();
    let t = t.as_ref();

    // If the target string is larger, then it's not possible to make T from S
    if t.len() > s.len() {
        return 0;
    }

    let mut answer = 0;
    let mut cache = HashMap::new();

    for i in 0..(s.len() - t.len() + 1) {
        answer += backtrack(&mut cache, s, i, t, 0);
    }

    answer
}

fn backtrack(
    cache: &mut HashMap<(usize, usize), i32>,
    s: &[u8],
    si: usize,
    t: &[u8],
    ti: usize,
) -> i32 {
    // The characters are different, or there are no enough characters
    //in S to match all the remaining letters in T
    if s[si] != t[ti] || s[si..].len() < t[ti..].len() {
        return 0;
    }

    // we have matched all characters from T
    if ti == t.len() - 1 {
        return 1;
    }

    // This combination was already computed, so we can just retrieve it
    // from the cache and avoid recomputing it again
    if let Some(answer) = cache.get(&(si, ti)).copied() {
        return answer;
    }

    let mut answer = 0;
    for i in si + 1..s.len() {
        answer += backtrack(cache, s, i, t, ti + 1);
    }

    cache.insert((si, ti), answer);
    answer
}