export function getCharacterContainer(str: string, containerStartIndex: number, containerEnd: string): string {
   const containerEndIndex = str.substring(containerStartIndex).indexOf(containerEnd) + containerStartIndex;
   if (containerEndIndex < containerStartIndex) {
      throw new Error(`Character container is not closed with character ${containerEnd}`);
   }
   return str.substring(containerStartIndex + 1, containerEndIndex);
}
