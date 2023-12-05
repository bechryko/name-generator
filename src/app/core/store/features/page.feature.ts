import { AboutSubpages } from '@ngen-about/about-subpages';
import { generatorFlags } from '@ngen-generation/constants';
import { createFeature, createReducer, on } from '@ngrx/store';
import { pageActions } from '../actions/page.actions';
import { PageState } from '../states';

const initialState: PageState = {
   generator: generatorFlags.best,
   aboutSubpage: AboutSubpages.INTRODUCTION
};

export const pageFeature = createFeature({
   name: 'page',
   reducer: createReducer(
      initialState,
      on(pageActions.setGenerator, (state, { generator }) => ({
         ...state,
         generator
      })),
      on(pageActions.setAboutSubpage, (state, { subpage }) => ({
         ...state,
         aboutSubpage: subpage
      }))
   )
});
