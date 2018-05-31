import Vue from 'mpvue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        cards: [],
    },
    mutations: {
        /* eslint-disable no-param-reassign */
        setCards(state, cards) {
            state.cards = cards;
        },
        addCard(state, card) {
            state.cards.push(card);
        },
        setLike(state, index) {
            if (state.cards[index].isLike) state.cards[index].likes -= 1;
            else state.cards[index].likes += 1;
            state.cards[index].isLike = !state.cards[index].isLike;
        },
        deleteCard(state, index) {
            state.cards.splice(index, 1);
        },
        addComment(state, params) {
            state.cards[params.index].isComment = true;
            state.cards[params.index].comments.push(params.comment);
        },
    },
});

export default store;
