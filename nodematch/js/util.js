
var standing_moves = new Moves();
var move_lookup = {}
var move = new Move({move_id: "takedown", move_name: "TAKEDOWN", actor_value: 2, victim_value: 0, from_position: "NEUTRAL", actor_effect: "TOP", victim_effect: "BOTTOM"});
move_lookup.takedown = move;
move = new Move({move_id: "stalling1", move_name: "STALLING 1", actor_value: 0, victim_value: 0, from_position: "*"});
move_lookup.stalling1 = move;
move = new Move({move_id: "stalling2", move_name: "STALLING 2", actor_value: 0, victim_value: 1, from_position: "*"});
move_lookup.stalling2 = move;
move = new Move({move_id: "stalling3", move_name: "STALLING 3", actor_value: 0, victim_value: 2, from_position: "*"});
move_lookup.stalling3 = move;
move = new Move({move_id: "switch", move_name: "SWITCH", actor_value: 2, victim_value: 0, from_position: "BOTTOM", actor_effect: "TOP", victim_effect: "BOTTOM"});
move_lookup.switch = move;
move = new Move({move_id: "standup", move_name: "STANDUP", actor_value: 1, victim_value: 0, from_position: "BOTTOM", actor_effect: "NEUTRAL", victim_effect: "NEUTRAL"});
move_lookup.standup = move;
move = new Move({move_id: "backpoints", move_name: "BACKPOINTS", actor_value: 2, victim_value: 0, from_position: "TOP", actor_effect: "TOP", victim_effect: "BOTTOM"});
move_lookup.backpoints = move;
move = new Move({move_id: "nearfall", move_name: "NEARFALL", actor_value: 3, victim_value: 0, from_position: "TOP", actor_effect: "TOP", victim_effect: "BOTTOM"});
move_lookup.nearfall = move;

standing_moves.add( move_lookup.takedown );
standing_moves.add( move_lookup.stalling1 );
var bottom_moves = new Moves();
var top_moves = new Moves();

bottom_moves.add( move_lookup.switch );
bottom_moves.add( move_lookup.standup );

top_moves.add(move_lookup.backpoints );
top_moves.add(move_lookup.nearfall);

isStalling = function(str_id) {
    return str_id.indexOf('stalling') == 0;
}

moveComparison = function(val, wrestler) { 
    var move_id = val.get('move_id');
    if ( isStalling(move_id) ) {
        var count = wrestler.get('stalling_count') + 1;
        return val.get('move_id') == ('stalling'+count);
    } else {
        return val.get('from_position') == wrestler.get('position');
    }
}

