// https://leetcode.com/problems/stamping-the-sequence/solutions/2459639/rust-readable-greedy-solution-with-explanations/
const REPLACEMENT: u8 = b'*';

pub fn moves_to_stamp(stamp: impl AsRef<[u8]>, target: impl Into<Vec<u8>>) -> Vec<i32> {
    let stamp = stamp.as_ref();
    let mut target = target.into();

    // sanity check
    if target.is_empty() || stamp.is_empty() || stamp.len() > target.len() {
        return vec![];
    }

    // Fast check: because the stamp cannot go outside the boundaries
    // of `target`, the first and last characters of `target` must be
    // equal to the first and last characters of the `stamp`
    if stamp[0] != target[0] || stamp[stamp.len() - 1] != target[target.len() - 1] {
        return vec![];
    }

    // Check for character present in one of the strings,
    // but not present in the other
    let mut present = [false; (b'z' - b'a' + 1) as usize];
    for &ch in stamp.iter() {
        present[(ch - b'a') as usize] = true;
    }

    if !target
        .iter()
        .map(|ch| (ch - b'a') as usize)
        .all(|ch| present[ch])
    {
        // we've encountered a character that is not present in the
        // stamp, thus  it's impossible to create this string by
        // using the stamp
        return vec![];
    }

    // The number of characters we have undone/erased
    let mut erased = 0;

    // This is the minimum allowed position to place the stamp. We'll use it
    // to reduce the number of iterations we do. Once we remove all letters
    // from the beginning: i.e. "* * a b c", there is no point to start again
    // at index 0, because we'll again match only "*" characters
    let mut min_from = 0;

    // Because we cannot place the stamp outside the boundary of `target` we
    // have to calculate the rightmost safe position to place stamp at,because
    // placing it further to the right is an invalid operation.
    let mut max_from = target.len() - stamp.len() + 1;

    // A stack containing the starting position sof each "stamp"
    // operation in reverse order
    let mut answer = vec![];

    let mut prev_erased = target.len() + 1;
    while erased != target.len() && prev_erased != erased {
        prev_erased = erased;

        for idx in min_from..max_from {
            let window = &mut target[idx..idx + stamp.len()];

            if let Some(to_delete) = can_delete(&window, &stamp) {
                // A value of 0 means that we matched only '*' characters,
                // thus we must not update the answer.
                if 0 != to_delete {
                    erased += to_delete;
                    window.fill(REPLACEMENT);
                    answer.push(idx as i32);
                }

                // If we've deleted all letters from the start/end of 'target',
                // then we can exclude the starting/ending positions because they
                // will always lead to a match of 0 letters (i.e. all are replaced),
                // thus we can avoid that waste of cycles
                if min_from == idx {
                    min_from += 1;
                } else if max_from == idx {
                    max_from -= 1;
                }
            }
        }
    }

    // We failed to erase all letters. Thus, according to the problem
    // statement we must return an empty array
    if erased != target.len() {
        answer.clear();
    }

    answer.reverse();
    answer
}

fn can_delete(t: &[u8], s: &[u8]) -> Option<usize> {
    assert_eq!(t.len(), s.len());
    let mut to_delete = 0;

    for idx in 0..t.len() {
        if t[idx] == s[idx] {
            to_delete += 1;
            continue;
        }

        if t[idx] == REPLACEMENT {
            continue;
        }

        return None;
    }

    Some(to_delete)
}