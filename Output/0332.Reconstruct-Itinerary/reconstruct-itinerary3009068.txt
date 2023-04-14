// https://leetcode.com/problems/reconstruct-itinerary/solutions/3009068/rust-dfs-solution/
use std::collections::{HashMap, BTreeMap};

impl Solution {
    pub fn find_itinerary_recurse<'a>(ap_graph: &'a HashMap<&str, BTreeMap<&str, Vec<usize>>>, visit: &mut Vec<bool>, itinerary: &mut Vec<&'a str>) -> Option<Vec<String>> {
        if visit.iter().all(|b| *b == true) {
            let mut result = Vec::new();
            for &i in itinerary.iter() {
                result.push(String::from(i));
            }
            return Some(result);
        }
        let last_itinerary = unsafe { itinerary.last().unwrap_unchecked() };
        if let Some(adj_aps) = ap_graph.get(last_itinerary) {
            for (adj_ap, indices) in adj_aps.iter() {
                for &idx in indices.iter() {
                    if visit[idx] == true {
                        continue;
                    }
                    visit[idx] = true;
                    itinerary.push(adj_ap);
                    let result = Self::find_itinerary_recurse(ap_graph, visit, itinerary);
                    if result.is_some() {
                        return result;
                    }

                    itinerary.pop();
                    visit[idx] = false;
                    break;
                }
            }
        }
        None
    }

    pub fn find_itinerary(tickets: Vec<Vec<String>>) -> Vec<String> {
        let mut ap_graph: HashMap<&str, BTreeMap<&str, Vec<usize>>> = HashMap::new();
        for (idx, ticket) in tickets.iter().enumerate() {
            let (departure, arrival) = (&ticket[0], &ticket[1]);
            match ap_graph.get_mut(departure.as_str()) {
                Some(arrivals) => {
                    match arrivals.get_mut(arrival.as_str()) {
                        Some(ticket_idcs) => {
                            ticket_idcs.push(idx);
                        },
                        None => {
                            arrivals.insert(arrival, vec![idx]);
                        }
                    }
                },
                None => {
                    ap_graph.insert(departure, BTreeMap::from([(arrival.as_str(), vec![idx])]));
                }
            }
        }

        let mut itinerary = vec!["JFK"];
        let mut visit = vec![false; tickets.len()];
        Self::find_itinerary_recurse(&ap_graph, &mut visit, &mut itinerary).unwrap()
    }
}