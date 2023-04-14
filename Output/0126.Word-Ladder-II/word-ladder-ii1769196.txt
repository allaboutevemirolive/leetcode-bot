// https://leetcode.com/problems/word-ladder-ii/solutions/1769196/rust-bfs-dfs-two-solutions-updated-at-2022-08-14/
use std::collections::VecDeque;

pub fn find_ladders(
    begin_word: String,
    end_word: String,
    word_list: Vec<String>,
) -> Vec<Vec<String>> {
    // Make sure that both begin_word and and_word are present in the list
    let mut words = word_list;
    let mut idx_begin = words.len();
    let mut idx_end = words.len();

    for (idx, word) in words.iter().enumerate() {
        if idx_begin == words.len() {
            if word == &begin_word {
                idx_begin = idx;
            }
        }
        if idx_end == words.len() {
            if word == &end_word {
                idx_end = idx;
            }
        }

        if idx_begin < words.len() && idx_end < words.len() {
            break;
        }
    }

    // Fast path: the end_word is not present in the dictionary,
    // thus we can exit early, as there is no path from
    // begin_word to end_word
    if idx_end == words.len() {
        return vec![];
    }

    // make sure that the begin_word is present in the dictionary
    if idx_begin == words.len() {
        words.push(begin_word);
    }

    // make sure that the idx_begin will be the first index
    // make sure that the idx_end will be the last index
    let len = words.len() - 1;
    if idx_end == 0 && idx_begin == len {
        words.swap(0, len);
    } else if idx_end == 0 {
        words.swap(0, len);
        words.swap(0, idx_begin);
    } else if idx_begin == len {
        words.swap(0, len);
        words.swap(len, idx_end);
    } else {
        words.swap(0, idx_begin);
        words.swap(len, idx_end);
    }
    idx_begin = 0;
    idx_end = len;

    // Find the shortest distance from end_word to begin
    // and measure the distance of each word from the end_word
    let mut distances = match shortest_distances(&words, idx_end, idx_begin, words.len()) {
        None => {
            // There is no path from begin_word to end_word,
            // thus we can exit early
            return vec![];
        }

        Some(distances) => distances,
    };

    // Because we started backwards - from END to start, the
    // shortest distance is contained at the start position
    let shortest_distance = distances[idx_begin];

    // Remove all words that are at a distance greater than the
    // shortest distance, because, they cannot possibly be
    // part of a path. It's still possible to have words that are
    // not part of a path though, so will have to filter them out later
    remove_unreachable_words(&mut words, &mut distances, shortest_distance, idx_begin);

    // update the idx_len, because it was the last index
    idx_end = words.len() - 1;

    // Find the shortest distance from end_word to begin_word
    // and measure the distance of each word from the end_word
    // We do this in order to filter out the remaining words,
    // that are not part of a path
    let mut distances = match shortest_distances(&words, idx_begin, idx_end, words.len()) {
        None => {
            // There is no path from end_word to begin_word.
            // This cannot happen at this point, because we already
            // have found a path
            return vec![];
        }

        Some(distances) => distances,
    };

    // Remove the unreachable words that remained from the previous BFS
    remove_unreachable_words(&mut words, &mut distances, shortest_distance, idx_end);

    // Include the index of the word next to its distance,
    // in order to preserve the indexes when sorted by their distance
    let mut distances = distances
        .into_iter()
        .enumerate()
        .map(|(idx, dist)| (dist, idx))
        .collect::<Vec<_>>();

    // Sort the distances in ascending order, in order to be able to
    // create an index over them to speed up the DFS
    distances.sort_unstable();

    // Create an index of the starting point of each "distance layer"
    let mut distance_indexes = Vec::with_capacity(shortest_distance + 1);
    for distance in 0..=shortest_distance {
        distance_indexes.push(first_index_with_distance(&distances, distance));
    }

    let mut answer = vec![];
    let mut path = vec![];
    collect_paths(
        &mut answer,
        &mut path,
        &distances,
        &distance_indexes,
        &words,
    );
    answer
}

fn is_adjacent(a: &str, b: &str) -> bool {
    assert_eq!(a.len(), b.len());

    a.bytes()
        .zip(b.bytes())
        .filter(|&(a, b)| a != b)
        .take(2)
        .count()
        == 1
}

fn shortest_distances(words: &[String], from: usize, to: usize, max: usize) -> Option<Vec<usize>> {
    let mut dists = vec![usize::MAX; words.len()];
    let mut queue = VecDeque::new();
    queue.push_back(from);

    let mut dist = 0;
    while !queue.is_empty() {
        for _ in 0..queue.len() {
            let idx = queue.pop_front().unwrap();
            if dists[idx] <= dist {
                continue;
            }
            dists[idx] = dist;

            // We are interested only in the shortest path,
            // Thus if a node is at a distance greater than, or equal
            // to the shortest known distance, than we can skip it
            if dist >= dists[to] {
                continue;
            }

            let current_word = words[idx].as_str();
            for (next_idx, next_word) in words.iter().enumerate() {
                if dists[next_idx] <= dist + 1 {
                    continue;
                }

                if is_adjacent(current_word, next_word) {
                    queue.push_back(next_idx);
                }
            }
        }
        dist += 1;

        // If we've reached the maximum allowed distance,
        // or if all the other distances will be longer
        // than the shortest one, we can stop here
        if dist > max || dist > dists[to] {
            break;
        }
    }

    match dists[to] <= max {
        true => Some(dists),
        false => None,
    }
}

// Remove all words that are at a distance greater than the
// max_distance, because, they cannot possibly be
// part of a path.
fn remove_unreachable_words(
    words: &mut Vec<String>,
    distances: &mut Vec<usize>,
    max_distance: usize,
    target_word: usize,
) {
    let mut index = 0;
    words.retain(|_| {
        index += 1;
        distances[index - 1] < max_distance || target_word == index - 1
    });

    index = 0;
    distances.retain(|&x| {
        index += 1;
        x < max_distance || target_word == index - 1
    });
}

fn collect_paths<'l>(
    answer: &mut Vec<Vec<String>>,
    path: &mut Vec<&'l str>,
    distances: &[(usize, usize)],
    distance_indexes: &[usize],
    words: &'l [String],
) {
    if distance_indexes.is_empty() {
        answer.push(path.iter().map(|&x| x.to_owned()).collect());
        return;
    }

    // We use the skip_positions and teh distance_level
    // variables to iterate over the portion of the array
    // that has the same distance and skip the rest
    let skip_positions = distance_indexes[0];
    let distance_level = distances[skip_positions].0;

    for &(dist, pos) in distances.iter().skip(skip_positions) {
        if dist != distance_level {
            break;
        }

        if path.is_empty() || is_adjacent(path[path.len() - 1], &words[pos]) {
            path.push(words[pos].as_str());
            collect_paths(answer, path, distances, &distance_indexes[1..], words);
            path.pop();
        }
    }
}

fn first_index_with_distance(distances: &[(usize, usize)], distance: usize) -> usize {
    let mut lo = 0;
    let mut hi = distances.len() - 1;

    while lo < hi {
        let mid = lo + (hi - lo) / 2;

        if distances[mid].0 < distance {
            lo = mid + 1;
        } else {
            hi = mid;
        }
    }

    lo
}