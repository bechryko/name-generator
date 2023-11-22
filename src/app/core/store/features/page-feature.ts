import { AboutSubpages } from '@ngen-about/about-subpages';
import { Generators } from '@ngen-generation/enums';
import { createFeature, createReducer, on } from '@ngrx/store';
import { PageState } from '../states';
import { pageActions } from './../actions/page-actions';

const initialState: PageState = {
   generator: Generators.JAPANESE,
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
