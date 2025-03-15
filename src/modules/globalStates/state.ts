import { reactive, watch } from "vue";

//initialize the state
const isLoggedInFromtStorage = localStorage.getItem('isLoggedIn') === 'true';


export const state = reactive({
  isLoggedIn: isLoggedInFromtStorage ,
} )

// watch for changes in the state
watch(() => state.isLoggedIn, (newValue) => {
  localStorage.setItem('isLoggedIn', String(newValue));

}
)
